export type GeneratedMarketingImage = {
  title: string;
  summary: string;
  imageUrl: string;
  revisedPrompt?: string;
  /** Which image model produced this (gpt-image-1.5, gpt-image-1, or dall-e-3 fallback). */
  modelUsed?: string;
  error?: string;
};
