import { VerificationQuestion, getRandomQuestion, validateAnswer } from '@/data/verification-questions';

export type EmailConversationStep = 
  | 'collecting_name'      // Step 1: "What's your name?"
  | 'collecting_email'     // Step 2: "What's your email?"
  | 'collecting_message'   // Step 3: "What would you like to tell him?"
  | 'verifying_human'      // Step 4: Random verification question
  | 'sending' 
  | 'complete' 
  | null;

export interface EmailConversationState {
  step: EmailConversationStep;
  userName?: string;        // Collected first
  userEmail?: string;       // Collected second
  userMessage?: string;     // Collected third
  currentQuestion?: VerificationQuestion;
  usedQuestionIds: string[];
}

// Global state for email conversation (simple approach for now)
let emailConversationState: EmailConversationState = {
  step: null,
  usedQuestionIds: []
};

export function isEmailTrigger(message: string): boolean {
  const emailTriggers = [
    /send.*email.*roberto/i,
    /contact.*roberto/i,
    /email.*roberto/i,
    /reach.*out.*roberto/i,
    /get.*in.*touch.*roberto/i
  ];
  
  return emailTriggers.some(pattern => pattern.test(message));
}

export function startEmailConversation(): string {
  emailConversationState = {
    step: 'collecting_name',  // Start with name collection
    usedQuestionIds: []
  };
  
  return "I'd be happy to help you send Roberto an email! What's your name so Roberto knows who's reaching out?";
}

function isValidName(name: string): boolean {
  const trimmedName = name.trim();
  
  // Basic validation rules
  if (trimmedName.length < 2) return false;
  if (trimmedName.length > 100) return false;
  
  // Allow letters, spaces, hyphens, apostrophes (international names)
  const nameRegex = /^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\s'-]+$/;
  return nameRegex.test(trimmedName);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function handleEmailMessage(message: string): { response: string; action?: 'SEND_EMAIL' } {
  const state = emailConversationState;
  
  switch (state.step) {
    case 'collecting_name':
      const name = message.trim();
      
      if (!isValidName(name)) {
        return {
          response: "Could you please provide your full name? Just your first and last name would be perfect."
        };
      }
      
      // Store name and move to email collection
      emailConversationState = {
        ...state,
        step: 'collecting_email',
        userName: name
      };
      
      return {
        response: `Nice to meet you, ${name}! What's your email address so Roberto can reply to you?`
      };
    
    case 'collecting_email':
      const email = message.trim();
      
      if (!isValidEmail(email)) {
        return {
          response: "That doesn't look like a valid email address. Could you please provide a valid email so Roberto can reply?"
        };
      }
      
      // Store email and move to message collection
      emailConversationState = {
        ...state,
        step: 'collecting_message',
        userEmail: email
      };
      
      return {
        response: "Perfect! Just need to verify you're human first. What would you like to tell him?"
      };
    
    case 'collecting_message':
      // Store message and move to verification
      const question = getRandomQuestion(state.usedQuestionIds);
      emailConversationState = {
        ...state,
        step: 'verifying_human',
        userMessage: message.trim(),
        currentQuestion: question,
        usedQuestionIds: [...state.usedQuestionIds, question.id]
      };
      
      return {
        response: `Great message! ${question.question}`
      };
    
    case 'verifying_human':
      if (!state.currentQuestion) {
        // Fallback - shouldn't happen
        return { response: "Something went wrong. Let's start over." };
      }
      
      const isCorrect = validateAnswer(state.currentQuestion, message);
      
      if (isCorrect) {
        // Correct answer - send email and complete
        emailConversationState = {
          ...state,
          step: 'complete'
        };
        
        return {
          response: "You're absolutely right! Your message has been sent to Roberto. He typically responds within 24-48 hours.",
          action: 'SEND_EMAIL'
        };
      } else {
        // Wrong answer - try different question
        const newQuestion = getRandomQuestion(state.usedQuestionIds);
        emailConversationState = {
          ...state,
          currentQuestion: newQuestion,
          usedQuestionIds: [...state.usedQuestionIds, newQuestion.id]
        };
        
        return {
          response: `That's not quite right, but no worries! Let me try a different question. ${newQuestion.question}`
        };
      }
    
    default:
      return { response: "I'm not sure what happened. Let's start over." };
  }
}

export function getEmailConversationState(): EmailConversationState {
  return emailConversationState;
}

export function resetEmailConversation(): void {
  emailConversationState = {
    step: null,
    usedQuestionIds: []
  };
}

export function isInEmailConversation(): boolean {
  return emailConversationState.step !== null && emailConversationState.step !== 'complete';
}
