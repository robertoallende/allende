export const disclaimerMessages = [
  // Self-Deprecating Tech Humor
  "RobertoGPT can make mistakes. Especially about football predictions.",
  "RobertoGPT can make mistakes. Still learning to code without Stack Overflow.",
  "RobertoGPT can make mistakes. May confuse Python with actual snakes.",
  "RobertoGPT can make mistakes. Still debugging my personality.",
  "RobertoGPT can make mistakes. Not serverless, just server-less reliable.",
  
  // Personal/Quirky
  "RobertoGPT can make mistakes. Powered by coffee and Real Madrid bias.",
  "RobertoGPT can make mistakes. Truth is like poetry, and I'm no poet.",
  "RobertoGPT can make mistakes. Amateur footballer, amateur AI.",
  "RobertoGPT can make mistakes. Enthusiastic and tireless, but not infallible.",
  
  // AWS/Tech References
  "RobertoGPT can make mistakes. Lambda functions may return undefined humor.",
  "RobertoGPT can make mistakes. Trained on AWS docs and football rants.",
  "RobertoGPT can make mistakes. My neural network runs on Next.js and hope.",
  
  // Meta/Honest
  "RobertoGPT can make mistakes. Actually, it's just Roberto pretending to be an AI.",
  "RobertoGPT can make mistakes. Trained on Roberto's blog posts and strong opinions.",
  "RobertoGPT can make mistakes. Built with TypeScript, powered by stubbornness.",
  
  // Creative/Funny
  "RobertoGPT can make mistakes. Side effects may include excessive AWS enthusiasm.",
  "RobertoGPT can make mistakes. Warning: May spontaneously discuss Real Madrid.",
  "RobertoGPT can make mistakes. Accuracy not guaranteed, entertainment value high.",
  "RobertoGPT can make mistakes. Hallucinations may include perfect Lambda deployments.",
  "RobertoGPT can make mistakes. Currently running on version 'works on my machine'."
];

export function getRandomDisclaimer(): string {
  const randomIndex = Math.floor(Math.random() * disclaimerMessages.length);
  return disclaimerMessages[randomIndex];
}

export function getDisclaimerCount(): number {
  return disclaimerMessages.length;
}
