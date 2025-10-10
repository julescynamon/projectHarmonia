// src/lib/analytics.ts

export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  googleSearchConsoleId?: string;
  facebookPixelId?: string;
  hotjarId?: string;
}

export function getAnalyticsConfig(): AnalyticsConfig {
  return {
    googleAnalyticsId: import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID,
    googleTagManagerId: import.meta.env.PUBLIC_GOOGLE_TAG_MANAGER_ID,
    googleSearchConsoleId: import.meta.env.PUBLIC_GOOGLE_SEARCH_CONSOLE_ID,
    facebookPixelId: import.meta.env.PUBLIC_FACEBOOK_PIXEL_ID,
    hotjarId: import.meta.env.PUBLIC_HOTJAR_ID
  };
}

// Événements de conversion pour le tracking SEO
export const conversionEvents = {
  // Événements de contact
  contactFormSubmit: 'contact_form_submit',
  appointmentRequest: 'appointment_request',
  phoneCall: 'phone_call',
  emailContact: 'email_contact',
  
  // Événements de navigation
  servicePageView: 'service_page_view',
  blogPostRead: 'blog_post_read',
  aboutPageView: 'about_page_view',
  
  // Événements de conversion
  newsletterSignup: 'newsletter_signup',
  downloadResource: 'download_resource',
  socialShare: 'social_share'
};

// Configuration des objectifs de conversion
export const conversionGoals = {
  primary: {
    name: 'Demande de contact',
    value: 100,
    events: [conversionEvents.contactFormSubmit, conversionEvents.appointmentRequest]
  },
  secondary: {
    name: 'Engagement contenu',
    value: 50,
    events: [conversionEvents.blogPostRead, conversionEvents.newsletterSignup]
  },
  tertiary: {
    name: 'Navigation services',
    value: 25,
    events: [conversionEvents.servicePageView, conversionEvents.aboutPageView]
  }
};

// Fonction pour tracker les événements de conversion
export function trackConversion(eventName: string, value?: number, customData?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      value: value,
      custom_parameters: customData
    });
  }
}

// Fonction pour tracker les pages vues
export function trackPageView(pageName: string, pagePath: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', getAnalyticsConfig().googleAnalyticsId, {
      page_title: pageName,
      page_location: pagePath
    });
  }
}

// Fonction pour tracker les interactions utilisateur
export function trackUserInteraction(action: string, category: string, label?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
}

// Configuration des métriques SEO
export const seoMetrics = {
  // Métriques de performance
  performance: {
    lcp: 'largest_contentful_paint',
    fid: 'first_input_delay',
    cls: 'cumulative_layout_shift'
  },
  
  // Métriques d'engagement
  engagement: {
    timeOnPage: 'time_on_page',
    scrollDepth: 'scroll_depth',
    bounceRate: 'bounce_rate'
  },
  
  // Métriques de conversion
  conversion: {
    contactRate: 'contact_rate',
    appointmentRate: 'appointment_rate',
    newsletterRate: 'newsletter_rate'
  }
};

// Fonction pour mesurer les Core Web Vitals
export function measureCoreWebVitals() {
  if (typeof window !== 'undefined') {
    // Mesurer LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      trackUserInteraction('lcp_measurement', 'performance', lastEntry.startTime.toString());
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Mesurer FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        trackUserInteraction('fid_measurement', 'performance', entry.processingStart.toString());
      });
    }).observe({ entryTypes: ['first-input'] });

    // Mesurer CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      trackUserInteraction('cls_measurement', 'performance', clsValue.toString());
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

// Fonction pour mesurer la profondeur de scroll
export function measureScrollDepth() {
  if (typeof window !== 'undefined') {
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 90, 100];
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        scrollThresholds.forEach(threshold => {
          if (scrollPercent >= threshold && maxScroll < threshold + 10) {
            trackUserInteraction('scroll_depth', 'engagement', `${threshold}%`);
          }
        });
      }
    });
  }
}

// Fonction pour mesurer le temps sur la page
export function measureTimeOnPage() {
  if (typeof window !== 'undefined') {
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      trackUserInteraction('time_on_page', 'engagement', timeOnPage.toString());
    });
  }
}

// Initialisation des métriques SEO
export function initSEOMetrics() {
  if (typeof window !== 'undefined') {
    measureCoreWebVitals();
    measureScrollDepth();
    measureTimeOnPage();
  }
}
