export enum Vibe {
  Playful = 'playful',
  Romantic = 'romantic',
  Bold = 'bold',
  Witty = 'witty',
  Mysterious = 'mysterious',
  Sweet = 'sweet',
  Poetic = 'poetic',
  Sexual = 'sexual',
}

export interface FlirtyTextResponse {
  messages: string[];
}

export interface CoachReply {
  reply: string;
  explanation: string;
}

export interface ConversationCoachResponse {
  replies: CoachReply[];
}

export interface ChatCritique {
  originalMessage: string;
  critique: string;
  suggestion: string;
}

export interface ChatReviewResponse {
  overallFeedback: string;
  critiques: ChatCritique[];
}

export interface PhotoCritique {
    photoDescription: string;
    critique: string;
    suggestion: string;
}

export interface BioCritique {
    critique: string;
    suggestion: string;
}

export interface ProfileAnalysisResponse {
    overallFeedback: string;
    photoAnalysis: PhotoCritique[];
    bioAnalysis: BioCritique;
}

export interface DateIdea {
  title: string;
  description: string;
  emoji: string;
}

export interface DateIdeaResponse {
  ideas: DateIdea[];
}
