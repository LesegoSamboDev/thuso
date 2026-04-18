import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from '@google/generative-ai';

/** Primary model; override with GEMINI_MODEL. */
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';

/** Comma-separated override; otherwise we try common alternates on 429 (separate quotas). */
function fallbackModelIds(): string[] {
  const fromEnv = process.env.GEMINI_FALLBACK_MODELS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (fromEnv?.length) {
    return fromEnv;
  }
  return ['gemini-2.5-flash', 'gemini-1.5-flash-002', 'gemini-2.0-flash-lite-001'];
}

function modelTryOrder(): string[] {
  const primary = GEMINI_MODEL;
  const rest = fallbackModelIds().filter((m) => m !== primary);
  return [primary, ...rest];
}

function getGenAI() {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error('Missing GEMINI_API_KEY');
  }
  return new GoogleGenerativeAI(key);
}

function parseRetryAfterSeconds(message: string): number | undefined {
  const m = message.match(/Please retry in ([0-9.]+)s/i);
  if (!m) return undefined;
  const n = Math.ceil(parseFloat(m[1]));
  return Number.isFinite(n) ? Math.min(Math.max(n, 1), 120) : undefined;
}

const systemPrompt = `You are a world-class marketing consultant with expertise in digital and physical product marketing, consumer psychology, and growth strategy. When given a product, you provide deeply researched, actionable, and specific marketing advice. Always return structured JSON — no markdown, no extra text, just valid JSON.`;

function buildUserPrompt(description: string, price: string, location: string, hasImage: boolean): string {
  return `Analyze this product and generate a comprehensive marketing strategy.

Product Details:
- Description: R{description}
- Price: RR{price}
- Business Location: R{location}
R{hasImage ? '- Product image has been provided for visual context.' : ''}

Return a JSON object with this exact structure:
{
  "targetAudience": {
    "demographics": "Age range, gender, income level, occupation, education — be specific",
    "psychographics": "Values, lifestyle, interests, buying behavior",
    "painPoints": ["pain point 1", "pain point 2", "pain point 3", "pain point 4"]
  },
  "positioning": {
    "valueProposition": "Clear, compelling value proposition statement",
    "competitiveAdvantage": "What makes this product uniquely positioned in the market",
    "brandVoice": "Recommended tone and personality for all communications"
  },
  "pricingFeedback": {
    "assessment": "Quick verdict on the current price point (e.g. 'Underpriced for the value delivered')",
    "recommendation": "Specific pricing recommendation with exact numbers or ranges",
    "reasoning": "Market-based reasoning for the recommendation"
  },
  "contentIdeas": {
    "tiktok": ["idea 1", "idea 2", "idea 3"],
    "instagram": ["idea 1", "idea 2", "idea 3"],
    "ads": ["ad concept 1", "ad concept 2", "ad concept 3"]
  },
  "hooks": [
    "Hook 1 — short, punchy, scroll-stopping",
    "Hook 2 — short, punchy, scroll-stopping",
    "Hook 3 — short, punchy, scroll-stopping",
    "Hook 4 — short, punchy, scroll-stopping",
    "Hook 5 — short, punchy, scroll-stopping"
  ],
  "improvements": [
    "Specific improvement 1",
    "Specific improvement 2",
    "Specific improvement 3",
    "Specific improvement 4"
  ]
}`;
}

type GenerateInput =
  | string
  | (string | { inlineData: { data: string; mimeType: string } })[];

async function generateJson(genAI: GoogleGenerativeAI, modelId: string, input: GenerateInput): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: modelId,
    systemInstruction: systemPrompt,
    generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 2000, temperature: 0.7 },
  });
  const result = await model.generateContent(input);
  return result.response.text();
}

export async function POST(req: NextRequest) {
  try {
    const { image, price, description, location } = await req.json();

    if (!description || !price || !location) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const genAI = getGenAI();
    const models = modelTryOrder();

    let last429Message = '';
    for (const modelId of models) {
      try {
        let text: string;
        if (image && image.startsWith('data:image')) {
          const [meta, base64Data] = image.split(',');
          const mimeType = meta.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
          const contents = [
            { inlineData: { data: base64Data, mimeType } },
            buildUserPrompt(description, price, location, true),
          ];
          text = await generateJson(genAI, modelId, contents);
        } else {
          text = await generateJson(genAI, modelId, buildUserPrompt(description, price, location, false));
        }
        return NextResponse.json(JSON.parse(text));
      } catch (e) {
        if (e instanceof GoogleGenerativeAIFetchError && e.status === 429) {
          last429Message = e.message;
          continue;
        }
        throw e;
      }
    }

    const retryAfter = last429Message ? parseRetryAfterSeconds(last429Message) : undefined;
    const body = {
      error:
        'Gemini rate limit reached for this model on the free tier. Wait a minute and retry, enable billing in Google AI Studio, or set GEMINI_MODEL / GEMINI_FALLBACK_MODELS to other models. See https://ai.google.dev/gemini-api/docs/rate-limits',
      modelsTried: models,
    };
    const res = NextResponse.json(body, { status: 429 });
    if (retryAfter != null) {
      res.headers.set('Retry-After', String(retryAfter));
    }
    return res;
  } catch (err) {
    console.error('[/api/analyze] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error.';
    if (message.includes('Missing GEMINI_API_KEY')) {
      return NextResponse.json({ error: 'Server missing GEMINI_API_KEY.' }, { status: 503 });
    }
    if (message.includes('404') || message.toLowerCase().includes('not found')) {
      return NextResponse.json(
        { error: `OpenAI API error: R{err.message}` },
        { status: err.status ?? 500 }
      );
    }
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
