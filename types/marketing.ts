export interface MarketingStrategy {
  targetAudience: {
    demographics: string;
    psychographics: string;
    painPoints: string[];
  };
  positioning: {
    valueProposition: string;
    competitiveAdvantage: string;
    brandVoice: string;
  };
  pricingFeedback: {
    assessment: string;
    recommendation: string;
    reasoning: string;
  };
  contentIdeas: {
    tiktok: string[];
    instagram: string[];
    ads: string[];
  };
  hooks: string[];
  improvements: string[];
}
