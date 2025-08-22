"use client";

import { useState, useEffect, useRef } from "react";

interface SimpleMarkdownProps {
  children: string;
  className?: string;
  smooth?: boolean;
}

class MarkdownTextAnimator {
  private animationFrameId: number | null = null;
  private lastUpdateTime: number = Date.now();
  public currentText: string = "";
  public targetText: string = "";

  constructor(private setText: (text: string) => void) {}

  start() {
    if (this.animationFrameId !== null) return;
    this.lastUpdateTime = Date.now();
    this.animate();
  }

  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private animate = () => {
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastUpdateTime;
    let timeToConsume = deltaTime;

    const remainingChars = this.targetText.length - this.currentText.length;
    const baseTimePerChar = Math.min(5, 250 / remainingChars);

    let charsToAdd = 0;
    while (timeToConsume >= baseTimePerChar && charsToAdd < remainingChars) {
      charsToAdd++;
      timeToConsume -= baseTimePerChar;
    }

    if (charsToAdd !== remainingChars) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    } else {
      this.animationFrameId = null;
    }
    
    if (charsToAdd === 0) return;

    this.currentText = this.targetText.slice(
      0,
      this.currentText.length + charsToAdd,
    );
    this.lastUpdateTime = currentTime - timeToConsume;
    this.setText(this.currentText);
  };
}

// Simple markdown parser for basic elements
function parseMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-base font-medium mb-2 mt-4">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mb-3 mt-6">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mb-4 pb-2 border-b border-border">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>')
    
    // Lists (simple approach)
    .replace(/^- (.*$)/gm, '<li class="flex items-start mb-1"><span class="mr-2">•</span><span>$1</span></li>')
    
    // Paragraphs (split by double newlines)
    .split('\n\n')
    .map(paragraph => {
      // Don't wrap headers, lists, or already wrapped content in p tags
      if (paragraph.includes('<h') || paragraph.includes('<li') || paragraph.includes('<div')) {
        return paragraph;
      }
      // Handle single line breaks within paragraphs
      const content = paragraph.replace(/\n/g, '<br>');
      return content.trim() ? `<p class="mb-4 leading-relaxed">${content}</p>` : '';
    })
    .join('\n');
}

export function SimpleMarkdown({ children, className, smooth = true }: SimpleMarkdownProps) {
  const [displayedText, setDisplayedText] = useState(smooth ? "" : children);
  const animatorRef = useRef<MarkdownTextAnimator | null>(null);

  useEffect(() => {
    if (!smooth) {
      setDisplayedText(children);
      return;
    }

    if (!animatorRef.current) {
      animatorRef.current = new MarkdownTextAnimator(setDisplayedText);
    }

    const animator = animatorRef.current;
    animator.targetText = children;
    animator.currentText = "";
    setDisplayedText("");
    animator.start();

    return () => {
      animator.stop();
    };
  }, [children, smooth]);

  useEffect(() => {
    return () => {
      if (animatorRef.current) {
        animatorRef.current.stop();
      }
    };
  }, []);

  const htmlContent = parseMarkdown(displayedText);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
