/**
 * Google Analytics 4 Integration
 * Privacy-compliant analytics tracking for the conversational portfolio
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_MEASUREMENT_ID = 'G-TXYD29HN0T';

/**
 * Initialize Google Analytics
 * Only runs in production environment
 */
export const initGA = () => {
  // Only initialize in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('Analytics: Skipping GA initialization in development');
    return;
  }

  // Check if already initialized
  if (typeof window.gtag !== 'undefined') {
    return;
  }

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Configure GA4 with privacy settings
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    // Privacy-first configuration
    anonymize_ip: true,
    cookie_flags: 'SameSite=Strict;Secure',
    cookie_expires: 60 * 60 * 24 * 30, // 30 days
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  console.log('Analytics: GA4 initialized');
};

/**
 * Track page views
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_location: url,
      page_title: title,
    });
  }
};

/**
 * Track custom events
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  customDimensions?: Record<string, string>
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...customDimensions,
    });
  }
};

/**
 * Track chat interactions
 */
export const trackChatInteraction = (
  action: 'topic_select' | 'message_send' | 'email_submit' | 'content_view' | 'fallback_response',
  topic: string,
  details?: Record<string, unknown>
) => {
  trackEvent(action, 'chat_interaction', topic, undefined, {
    chat_topic: topic,
    ...(details && Object.fromEntries(
      Object.entries(details).map(([key, value]) => [key, String(value)])
    )),
  });
};

/**
 * Track user type based on entry point and referrer
 */
export const trackUserType = (entryPoint: string, referrer?: string) => {
  let userType = 'direct';
  
  if (referrer && referrer.includes('google')) {
    userType = 'search_engine';
  } else if (referrer && !referrer.includes(window.location.hostname)) {
    userType = 'referral';
  }

  trackEvent('user_classification', 'user_behavior', userType, undefined, {
    user_type: userType,
    entry_point: entryPoint,
  });
};

/**
 * Track email submission conversion
 */
export const trackEmailSubmission = (
  step: 'initiated' | 'completed' | 'failed',
  details?: Record<string, unknown>
) => {
  trackChatInteraction('email_submit', 'contact_form', {
    submission_step: step,
    ...details
  });

  // Track as conversion event if completed
  if (step === 'completed') {
    trackEvent('conversion', 'email_submission', 'contact_form', 1);
  }
};

/**
 * Track performance metrics
 */
export const trackPerformance = (metric: string, value: number, unit: string) => {
  trackEvent('performance_metric', 'site_performance', metric, value, {
    metric_unit: unit,
  });
};

/**
 * Track fallback responses (when chat doesn't match content)
 */
export const trackFallbackResponse = (userMessage: string, responseUsed: string) => {
  trackChatInteraction('fallback_response', 'unknown_topic', {
    user_message_preview: userMessage.substring(0, 50), // First 50 chars for privacy
    response_type: 'fallback',
    fallback_response: responseUsed.substring(0, 50),
  });
};
