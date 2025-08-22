"use client";

import { useState, useEffect, useRef } from "react";

interface SmoothTextProps {
  children: string;
  className?: string;
  smooth?: boolean;
}

class SimpleTextAnimator {
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

export function SmoothText({ children, className, smooth = true }: SmoothTextProps) {
  const [displayedText, setDisplayedText] = useState(smooth ? "" : children);
  const animatorRef = useRef<SimpleTextAnimator | null>(null);

  useEffect(() => {
    if (!smooth) {
      setDisplayedText(children);
      return;
    }

    if (!animatorRef.current) {
      animatorRef.current = new SimpleTextAnimator(setDisplayedText);
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

  return (
    <div className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {displayedText}
    </div>
  );
}
