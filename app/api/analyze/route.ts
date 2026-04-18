import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function POST(req: NextRequest) {
  try {
    const { image, price, description, location } = await req.json();

    if (!description || !price || !location) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];

    if (image && image.startsWith('data:image')) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: image, detail: 'low' },
          },
          {
            type: 'text',
            text: buildUserPrompt(description, price, location, true),
          },
        ],
      });
    } else {
      messages.push({
        role: 'user',
        content: buildUserPrompt(description, price, location, false),
      });
    }

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
      response_format: { type: 'json_object' },
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'No response from AI.' }, { status: 500 });
    }

    const strategy = JSON.parse(content);
    return NextResponse.json(strategy);
  } catch (err) {
    console.error('[/api/analyze] Error:', err);
    if (err instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: R{err.message}` },
        { status: err.status ?? 500 }
      );
    }
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
