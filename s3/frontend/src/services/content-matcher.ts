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
  async loadMatchedContent(userInput: string): Promise<MatchResult | null> {
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
      
      // Load content from file
      const response = await fetch(`/api/content/rules/${matchedRule.contentFile}`);
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
      const response = await fetch('/api/content/rules');
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
