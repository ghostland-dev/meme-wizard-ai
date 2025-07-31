import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Simple analytics tracker for production
export function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    const trackPageView = () => {
      // In production, replace this with your analytics service
      // Example: Google Analytics, Mixpanel, etc.
      if (import.meta.env.PROD) {
        console.log('Page view:', location.pathname);
        
        // Example Google Analytics tracking (uncomment and configure)
        // if (typeof gtag !== 'undefined') {
        //   gtag('config', 'GA_MEASUREMENT_ID', {
        //     page_path: location.pathname,
        //   });
        // }
      }
    };

    trackPageView();
  }, [location]);

  return null;
}

// Analytics event tracking functions
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    console.log('Event:', eventName, properties);
    
    // Example event tracking (uncomment and configure)
    // if (typeof gtag !== 'undefined') {
    //   gtag('event', eventName, properties);
    // }
  }
};

export const trackMemeGeneration = (style: string, hasImage: boolean, generationTime: number) => {
  trackEvent('meme_generated', {
    style,
    has_source_image: hasImage,
    generation_time_ms: generationTime,
  });
};

export const trackPurchase = (plan: string, amount: number) => {
  trackEvent('purchase', {
    plan,
    value: amount,
    currency: 'EUR',
  });
};