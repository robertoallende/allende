export interface VerificationQuestion {
  id: string;
  question: string;
  answers: string[]; // Multiple acceptable answers
}

export const verificationQuestions: VerificationQuestion[] = [
  {
    id: 'oracle',
    question: 'Is Roberto a strong supporter of Oracle Cloud?',
    answers: ['no', 'definitely no', 'hell no', 'oracle what?']
  },
  {
    id: 'football-team',
    question: 'What does Roberto write about?',
    answers: ['software', 'football', 'software engineering', 'ai', 'cloud', 'anything', 'nothing']
  },
  {
    id: 'poetry-quote',
    question: 'Complete this quote: "Truth is like..."',
    answers: ['poetry']
  },
  {
    id: 'tagline',
    question: 'What does Roberto call himself in his tagline?',
    answers: ['maker', 'enthusiastic and tireless maker', 'tireless maker', 'enthusiastic maker']
  },
  {
    id: 'origin',
    question: 'Did Roberto born in Hungary?',
    answers: ['yes', 'no']
  },
  {
    id: 'messi',
    question: 'Is Messi the GOAT',
    answers: ['yes', 'si']
  },
  {
    id: 'messi-two',
    question: 'Did Lionel Messi born in Argentina',
    answers: ['yes', 'si']
  },
  {
    id: 'messi-three',
    question: 'Did Lionel Messi win the World Cup trophy with his national team?',
    answers: ['yes', 'si']
  },
  {
    id: 'messi-four',
    question: 'Is Lionel Messi a better player than Maradona?',
    answers: ['yes', 'no']
  },
];

// Utility functions
export function getRandomQuestion(excludeIds: string[] = []): VerificationQuestion {
  const availableQuestions = verificationQuestions.filter(q => !excludeIds.includes(q.id));
  
  if (availableQuestions.length === 0) {
    // If all questions have been used, reset and pick from all
    const randomIndex = Math.floor(Math.random() * verificationQuestions.length);
    return verificationQuestions[randomIndex];
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  return availableQuestions[randomIndex];
}

export function validateAnswer(question: VerificationQuestion, userAnswer: string): boolean {
  const normalizedAnswer = userAnswer.toLowerCase().trim();
  return question.answers.some(correct => normalizedAnswer === correct.toLowerCase());
}
