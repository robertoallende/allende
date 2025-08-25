"use client";

import { useState, useEffect } from 'react';
import { getRandomDisclaimer } from '@/data/disclaimer-messages';

interface RandomDisclaimerProps {
  className?: string;
}

export function RandomDisclaimer({ className = "" }: RandomDisclaimerProps) {
  const [disclaimer, setDisclaimer] = useState<string>("");

  useEffect(() => {
    // Set random disclaimer on mount
    setDisclaimer(getRandomDisclaimer());
  }, []);

  // Don't render until we have a disclaimer (prevents hydration mismatch)
  if (!disclaimer) {
    return null;
  }

  return (
    <p className={`text-xs text-muted-foreground text-center ${className}`}>
      {disclaimer}
    </p>
  );
}
