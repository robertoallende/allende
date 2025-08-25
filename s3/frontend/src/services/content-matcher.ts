import { 
  isEmailTrigger, 
  startEmailConversation, 
  handleEmailMessage, 
  isInEmailConversation,
  resetEmailConversation 
} from './email-conversation-handler';

interface ContentRule {
  id: string;
  trigger: string;
  description: string;
  contentFile: string;
  priority: number;
}

interface ContentRules {
  rules: ContentRule[];
}

interface MatchResult {
  rule: ContentRule;
  content: string;
  originalMessage: string;
}

interface EmailResult {
  isEmail: true;
  response: string;
  action?: 'SEND_EMAIL';
  originalMessage: string;
}

type ContentMatchResult = MatchResult | EmailResult;

class ContentMatcher {
  private rules: ContentRule[] = [];
  private contentCache = new Map<string, string>();
  
  constructor(rules: ContentRules) {
    this.rules = rules.rules.sort((a, b) => a.priority - b.priority);
  }
  
  /**
   * Normalize text for matching: lowercase, no spaces
   */
  private normalizeText(input: string): string {
    return input
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^\w]/g, ''); // Remove punctuation for better matching
  }
  
  /**
   * Find matching content rule for user input
   */
  findMatch(userInput: string): ContentRule | null {
    const normalizedInput = this.normalizeText(userInput);
    
    // Skip very short inputs to avoid false positives
    if (normalizedInput.length < 3) {
      return null;
    }
    
    for (const rule of this.rules) {
      if (normalizedInput.includes(rule.trigger)) {
        return rule;
      }
    }
    
    return null;
  }
  
  /**
   * Load content for a matched rule
   */
  async loadMatchedContent(userInput: string): Promise<ContentMatchResult | null> {
    // Check if this is an email trigger
    if (isEmailTrigger(userInput)) {
      const response = startEmailConversation();
      return {
        isEmail: true,
        response,
        originalMessage: userInput
      };
    }
    
    // Check if we're in an email conversation
    if (isInEmailConversation()) {
      const result = handleEmailMessage(userInput);
      return {
        isEmail: true,
        response: result.response,
        action: result.action,
        originalMessage: userInput
      };
    }
    
    // Regular content matching
    const matchedRule = this.findMatch(userInput);
    
    if (!matchedRule) {
      return null;
    }
    
    try {
      // Check cache first
      if (this.contentCache.has(matchedRule.contentFile)) {
        return {
          rule: matchedRule,
          content: this.contentCache.get(matchedRule.contentFile)!,
          originalMessage: userInput
        };
      }
      
      // Load from static files instead of API routes
      const response = await fetch(`/content/responses/${matchedRule.contentFile}`);
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.statusText}`);
      }
      
      const content = await response.text();
      
      // Cache the content
      this.contentCache.set(matchedRule.contentFile, content);
      
      return {
        rule: matchedRule,
        content: content,
        originalMessage: userInput
      };
      
    } catch (error) {
      console.error('Error loading matched content:', error);
      return {
        rule: matchedRule,
        content: `# Content Not Available\n\nSorry, the content for "${matchedRule.description}" could not be loaded at this time.`,
        originalMessage: userInput
      };
    }
  }
  
  /**
   * Reset email conversation state
   */
  resetEmailConversation(): void {
    resetEmailConversation();
  }
  
  /**
   * Get all possible matches (for debugging/testing)
   */
  getAllMatches(userInput: string): ContentRule[] {
    const normalizedInput = this.normalizeText(userInput);
    
    return this.rules.filter(rule => 
      normalizedInput.includes(rule.trigger)
    );
  }
}

// Singleton instance
let contentMatcherInstance: ContentMatcher | null = null;

/**
 * Get or create the content matcher instance
 */
export async function getContentMatcher(): Promise<ContentMatcher> {
  if (!contentMatcherInstance) {
    try {
      // Load from static files instead of API routes
      const response = await fetch('/content/content-rules.json');
      if (!response.ok) {
        throw new Error('Failed to load content rules');
      }
      
      const rules: ContentRules = await response.json();
      contentMatcherInstance = new ContentMatcher(rules);
    } catch (error) {
      console.error('Error initializing content matcher:', error);
      // Fallback to empty rules
      contentMatcherInstance = new ContentMatcher({ rules: [] });
    }
  }
  
  return contentMatcherInstance;
}

export type { ContentRule, ContentRules, MatchResult };
