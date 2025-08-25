export const disclaimerMessages = [
  // Self-Deprecating Tech Humor
  "RobertoGPT can make mistakes. Especially about football predictions.",
  "RobertoGPT can make mistakes. May confuse Python with actual snakes.",
  "RobertoGPT can make mistakes. Still debugging my personality.",
  "RobertoGPT can make mistakes. Not serverless, just server-less reliable.",
  
  // Personal/Quirky
  "RobertoGPT can make mistakes. Powered by coffee and Manchester City bias.",
  "RobertoGPT can make mistakes. Powered by coffee and Club Atletico Belgrano bias.",
  "RobertoGPT can make mistakes. Truth is like poetry, and I'm no poet.",
  "RobertoGPT can make mistakes. Enthusiastic and tireless, but not infallible.",
  
  // AWS/Tech References
  "RobertoGPT can make mistakes. Lambda functions may return undefined humor.",
  "RobertoGPT can make mistakes. Trained on AWS docs and football rants.",
  "RobertoGPT can make mistakes. My neural network runs on Smalltalk and hope.",
  
  // Meta/Honest
  "RobertoGPT can make mistakes. Actually, it's just Roberto pretending to be an AI.",
  "RobertoGPT can make mistakes. Trained on Roberto's blog posts and strong opinions.",
  "RobertoGPT can make mistakes. Built with Python, powered by stubbornness.",
  
  // Creative/Funny
  "RobertoGPT can make mistakes. Side effects may include excessive AI enthusiasm.",
  "RobertoGPT can make mistakes. Accuracy not guaranteed, entertainment value high.",
  "RobertoGPT can make mistakes. Hallucinations may include perfect Lambda deployments.",

  // Messi
  "RobertoGPT can make mistakes. But questioning if Messi is the GOAT? Discussion closed.",
  "RobertoGPT can make mistakes. Except about Messi being the GOAT. Non-negotiable.",
  "RobertoGPT can make mistakes. But Messi as the GOAT? That's gospel."
];

export function getRandomDisclaimer(): string {
  const randomIndex = Math.floor(Math.random() * disclaimerMessages.length);
  return disclaimerMessages[randomIndex];
}

export function getDisclaimerCount(): number {
  return disclaimerMessages.length;
}
