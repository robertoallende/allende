'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGA, trackPageView, trackUserType, GA_MEASUREMENT_ID } from '@/lib/analytics';

/**
 * Analytics Component
 * Handles Google Analytics initialization and page tracking
 */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize GA on first mount
    initGA();

    // Track initial page view and classify user type
    const entryPoint = pathname === '/' ? 'homepage' : pathname.slice(1);
    trackPageView(window.location.href, document.title);
    trackUserType(entryPoint, document.referrer);
  }, [pathname]); // Include pathname in dependencies

  useEffect(() => {
    // Track page views on route changes
    if (typeof window !== 'undefined') {
      trackPageView(window.location.href, document.title);
    }
  }, [pathname]);

  // Only render script tags in production
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              anonymize_ip: true,
              cookie_flags: 'SameSite=Strict;Secure',
              cookie_expires: ${60 * 60 * 24 * 30},
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
          `,
        }}
      />
    </>
  );
}
