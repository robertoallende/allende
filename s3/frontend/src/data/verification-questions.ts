export interface VerificationQuestion {
  id: string;
  question: string;
  answers: string[]; // Multiple acceptable answers
}

export const verificationQuestions: VerificationQuestion[] = [
  {
    id: 'aws-language',
    question: 'What programming language does Roberto use for AWS Lambda functions?',
    answers: ['python', 'py']
  },
  {
    id: 'football-team',
    question: 'Which football team does Roberto support?',
    answers: ['real madrid', 'madrid', 'real']
  },
  {
    id: 'poetry-quote',
    question: 'Complete this quote from Roberto\'s site: "Truth is like..."',
    answers: ['poetry']
  },
  {
    id: 'tagline',
    question: 'What does Roberto call himself in his tagline?',
    answers: ['maker', 'enthusiastic and tireless maker', 'tireless maker', 'enthusiastic maker']
  },
  {
    id: 'website-framework',
    question: 'What frontend framework is this website built with?',
    answers: ['next.js', 'nextjs', 'next', 'react']
  }
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
