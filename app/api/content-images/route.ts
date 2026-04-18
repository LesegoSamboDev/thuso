import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { GeneratedMarketingImage } from '@/types/content-engine';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VISION_SYSTEM = `You are a creative director for e-commerce and paid social. You output only valid JSON, no markdown.`;

function buildVisionUserMessage(description: string | undefined): string {
  const ctx = description?.trim()
    ? `Additional context from the brand: "${description.trim()}"`
    : 'No extra text context — rely on the photo.';

  return `${ctx}

From the product photo, plan exactly 3 distinct paid-social style ads: different composition, lighting, and setting (e.g. lifestyle table, dramatic hero, outdoor gathering).

For each concept you MUST output:
- "headline": short punchy headline (max ~6 words) to appear ON the image — original wording, no real trademarked slogans from the photo.
- "subhead": optional second line (max ~10 words) for smaller type on the image, or empty string if none.
- "imagePrompt": one detailed English prompt for a photoreal image generator. It must:
  • Describe the scene, camera, lighting, and the product type (no copying real logos from the reference).
  • Explicitly instruct crisp, legible typography ON the image: state the exact headline and subhead to render (spell them letter-perfect in the prompt).
  • Specify font vibe (e.g. bold geometric sans, editorial serif) and placement (e.g. top third, lower banner).
  • Say: photorealistic, shot on professional camera, shallow depth of field, commercial food / product photography.
  • No watermarks, no UI mockups, no QR codes. No real celebrities. Generic people only if needed.

Return this JSON shape only:
{"concepts":[{"title":"short internal label","summary":"one line for the marketer","headline":"...","subhead":"... or empty string","imagePrompt":"full prompt here"}, ... exactly 3 items]}`;
}

type Concept = { title: string; summary: string; headline: string; subhead: string; imagePrompt: string };

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function isBlobLike(v: unknown): v is Blob {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as Blob).arrayBuffer === 'function' &&
    typeof (v as Blob).size === 'number'
  );
}

async function resolveImageAndDescription(req: NextRequest): Promise<
  | { ok: true; imageDataUrl: string; description?: string }
  | { ok: false; status: number; error: string }
> {
  const ct = req.headers.get('content-type') || '';

  if (ct.includes('multipart/form-data')) {
    const fd = await req.formData();
    const file = fd.get('image');
    if (!isBlobLike(file) || file.size === 0) {
      return { ok: false, status: 400, error: 'Upload a product image (PNG, JPG, or WEBP).' };
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return { ok: false, status: 400, error: 'Image too large (max 20MB).' };
    }
    const mime = file.type && ALLOWED_MIME.has(file.type) ? file.type : 'image/jpeg';
    const buf = Buffer.from(await file.arrayBuffer());
    const imageDataUrl = `data:${mime};base64,${buf.toString('base64')}`;
    const desc = fd.get('description');
    const description = typeof desc === 'string' && desc.trim() ? desc.trim() : undefined;
    return { ok: true, imageDataUrl, description };
  }

  const body = (await req.json()) as { image?: string; description?: string };
  const image = body.image;
  const description =
    typeof body.description === 'string' && body.description.trim()
      ? body.description.trim()
      : undefined;

  if (!image || typeof image !== 'string' || !image.startsWith('data:image')) {
    return { ok: false, status: 400, error: 'Upload a product image (PNG, JPG, or WEBP).' };
  }

  const approxBytes = Math.ceil((image.length * 3) / 4);
  if (approxBytes > MAX_IMAGE_BYTES) {
    return { ok: false, status: 400, error: 'Image too large (max 20MB).' };
  }

  return { ok: true, imageDataUrl: image, description };
}

async function generateOneImage(prompt: string): Promise<{
  imageUrl: string;
  revisedPrompt?: string;
  model: string;
  error?: string;
}> {
  const p = prompt.slice(0, 32000);
  const gptModels = ['gpt-image-1.5', 'gpt-image-1'] as const;

  for (const model of gptModels) {
    try {
      const gen = await client.images.generate({
        model,
        prompt: p,
        size: '1024x1024',
        quality: 'high',
        output_format: 'webp',
        output_compression: 82,
        moderation: 'low',
        n: 1,
      });
      const first = gen.data?.[0];
      const b64 = first?.b64_json;
      if (b64) {
        return {
          imageUrl: `data:image/webp;base64,${b64}`,
          revisedPrompt: first.revised_prompt,
          model,
        };
      }
    } catch {
      /* try next model */
    }
  }

  try {
    const gen = await client.images.generate({
      model: 'dall-e-3',
      prompt: p.slice(0, 4000),
      size: '1024x1024',
      quality: 'hd',
      style: 'natural',
      n: 1,
      response_format: 'url',
    });
    const first = gen.data?.[0];
    const url = first?.url;
    if (url) {
      return { imageUrl: url, revisedPrompt: first?.revised_prompt, model: 'dall-e-3' };
    }
  } catch (e) {
    return {
      imageUrl: '',
      model: 'dall-e-3',
      error: e instanceof Error ? e.message : 'Generation failed',
    };
  }

  return {
    imageUrl: '',
    model: 'none',
    error: 'Image model unavailable. Check API access for gpt-image-1 / gpt-image-1.5.',
  };
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY?.trim()) {
      return NextResponse.json(
        { error: 'Server is not configured with OPENAI_API_KEY.' },
        { status: 503 }
      );
    }

    const resolved = await resolveImageAndDescription(req);
    if (!resolved.ok) {
      return NextResponse.json({ error: resolved.error }, { status: resolved.status });
    }
    const { imageDataUrl, description } = resolved;

    const vision = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: VISION_SYSTEM },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageDataUrl, detail: 'low' } },
            { type: 'text', text: buildVisionUserMessage(description) },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
      temperature: 0.85,
    });

    const raw = vision.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: 'Could not plan visuals from this image.' }, { status: 500 });
    }

    let concepts: Concept[] = [];
    try {
      const parsed = JSON.parse(raw) as { concepts?: unknown[] };
      const rawList = Array.isArray(parsed.concepts) ? parsed.concepts.slice(0, 3) : [];
      concepts = rawList
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const o = item as Record<string, unknown>;
          const title = typeof o.title === 'string' ? o.title : 'Concept';
          const summary = typeof o.summary === 'string' ? o.summary : '';
          const legacy = typeof o.dallePrompt === 'string' ? o.dallePrompt : '';
          const imagePrompt = typeof o.imagePrompt === 'string' ? o.imagePrompt : legacy;
          const headline = typeof o.headline === 'string' ? o.headline : '';
          const subhead = typeof o.subhead === 'string' ? o.subhead : '';
          if (!imagePrompt.trim()) return null;
          return { title, summary, headline, subhead, imagePrompt };
        })
        .filter((c): c is Concept => c !== null);
    } catch {
      return NextResponse.json({ error: 'Invalid AI response. Try again.' }, { status: 500 });
    }

    if (concepts.length < 3) {
      return NextResponse.json(
        { error: 'Need 3 creative concepts from the model. Please retry.' },
        { status: 502 }
      );
    }

    const results: GeneratedMarketingImage[] = await Promise.all(
      concepts.map(async (c) => {
        const copyBlock =
          c.headline.trim().length > 0
            ? ` On-image text (spell exactly, legible typography): HEADLINE: "${c.headline.trim()}"${c.subhead?.trim() ? ` SUBHEAD: "${c.subhead.trim()}"` : ''}.`
            : '';
        const fullPrompt = `${c.imagePrompt.trim()}${copyBlock}`;

        const out = await generateOneImage(fullPrompt);
        if (out.error || !out.imageUrl) {
          return {
            title: c.title,
            summary: c.summary,
            imageUrl: '',
            error: out.error || 'No image data returned.',
            modelUsed: out.model,
          };
        }
        return {
          title: c.title,
          summary: c.summary,
          imageUrl: out.imageUrl,
          revisedPrompt: out.revisedPrompt,
          modelUsed: out.model,
        };
      })
    );

    return NextResponse.json({ images: results });
  } catch (err) {
    console.error('[/api/content-images]', err);
    if (err instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI: ${err.message}` },
        { status: err.status ?? 500 }
      );
    }
    const msg = err instanceof Error ? err.message : 'Something went wrong.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
