import generatedContent from './generated-content.json';

export interface LoadedContent {
  initialMessage: string;
  responses: string[];
  followUps: string[];
}

export function loadAllContent(): Record<string, LoadedContent> {
  return generatedContent as Record<string, LoadedContent>;
}
