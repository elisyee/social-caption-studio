export type PlatformId = "instagramTikTok" | "linkedIn" | "facebook";

export interface CaptionContent {
  label: string;
  platformName: string;
  audienceFocus: string;
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  fullCaption: string;
  headline?: string;
  charLimit: number;
}

export interface CaptionSet {
  instagramTikTok: CaptionContent;
  linkedIn: CaptionContent;
  facebook: CaptionContent;
}

export interface GenerationParams {
  topic: string;
  angle?: string;
  tone?: string;
  targetAudience?: string;
}

export interface TradeResource {
  code: string;
  name: string;
  description: string;
  badge: string;
}
