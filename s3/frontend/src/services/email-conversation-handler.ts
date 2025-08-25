import { VerificationQuestion, getRandomQuestion, validateAnswer } from '@/data/verification-questions';

export type EmailConversationStep = 'collecting_message' | 'collecting_email' | 'verifying_human' | 'sending' | 'complete' | null;

export interface EmailConversationState {
  step: EmailConversationStep;
  userMessage?: string;
  userEmail?: string;
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
    step: 'collecting_message',
    usedQuestionIds: []
  };
  
  return "I'd be happy to help you send Roberto an email! What would you like to tell him?";
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function handleEmailMessage(message: string): { response: string; action?: 'SEND_EMAIL' } {
  const state = emailConversationState;
  
  switch (state.step) {
    case 'collecting_message':
      // Store the user's message and ask for email
      emailConversationState = {
        ...state,
        step: 'collecting_email',
        userMessage: message.trim()
      };
      
      return {
        response: "Great message! What's your email address so Roberto can reply to you?"
      };
    
    case 'collecting_email':
      const email = message.trim();
      
      if (!isValidEmail(email)) {
        return {
          response: "That doesn't look like a valid email address. Could you please provide a valid email so Roberto can reply?"
        };
      }
      
      // Store email and move to verification
      const question = getRandomQuestion(state.usedQuestionIds);
      emailConversationState = {
        ...state,
        step: 'verifying_human',
        userEmail: email,
        currentQuestion: question,
        usedQuestionIds: [...state.usedQuestionIds, question.id]
      };
      
      return {
        response: `Perfect! Just need to verify you're human first. ${question.question}`
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
