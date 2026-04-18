import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const systemPrompt = `You are a world-class marketing consultant with expertise in digital and physical product marketing, consumer psychology, and growth strategy. When given a product, you provide deeply researched, actionable, and specific marketing advice. Always return structured JSON — no markdown, no extra text, just valid JSON.`;

function buildUserPrompt(description: string, price: string, location: string, hasImage: boolean): string {
  return `Analyze this product and generate a comprehensive marketing strategy.

Product Details:
- Description: ${description}
- Price: $${price}
- Business Location: ${location}
${hasImage ? '- Product image has been provided for visual context.' : ''}

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

export async function POST(req: NextRequest) {
  try {
    const { image, price, description, location } = await req.json();

    if (!description || !price || !location) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
      generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 2000, temperature: 0.7 },
    });

    const parts: Parameters<typeof model.generateContent>[0] extends { contents: infer C } ? C : never[] = [];

    if (image && image.startsWith('data:image')) {
      const [meta, base64Data] = image.split(',');
      const mimeType = meta.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
      const contents = [
        { inlineData: { data: base64Data, mimeType } },
        buildUserPrompt(description, price, location, true),
      ];
      const result = await model.generateContent(contents);
      const text = result.response.text();
      return NextResponse.json(JSON.parse(text));
    }

    const result = await model.generateContent(buildUserPrompt(description, price, location, false));
    const text = result.response.text();
    return NextResponse.json(JSON.parse(text));
  } catch (err) {
    console.error('[/api/analyze] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
