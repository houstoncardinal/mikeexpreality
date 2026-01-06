// Enhanced Analytics & Attribution System
// Tracks user behavior, conversion attribution, and provides business intelligence

interface AttributionEvent {
  id: string;
  timestamp: Date;
  sessionId: string;
  userId?: string;
  eventType: string;
  eventData: Record<string, any>;
  source: {
    channel: string;
    campaign?: string;
    referrer?: string;
    landingPage: string;
  };
  device: {
    type: string;
    browser: string;
    os: string;
  };
  location?: {
    country: string;
    region: string;
    city: string;
  };
}

interface ConversionFunnel {
  awareness: number;
  interest: number;
  consideration: number;
  intent: number;
  purchase: number;
  retention: number;
}

interface AttributionModel {
  firstTouch: Record<string, number>;
  lastTouch: Record<string, number>;
  multiTouch: Record<string, number>;
  timeDecay: Record<string, number>;
}

class EnhancedAnalyticsEngine {
  private events: AttributionEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private readonly MAX_EVENTS = 10000;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadFromStorage();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking(): void {
    // Track page views
    this.trackEvent('page_view', {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
    });

    // Track user interactions
    this.trackUserInteractions();

    // Track form submissions
    this.trackFormSubmissions();

    // Track outbound links
    this.trackOutboundLinks();
  }

  private trackUserInteractions(): void {
    // Track button clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button, a, [role="button"]');

      if (button) {
        const buttonText = button.textContent?.trim() || button.getAttribute('aria-label') || 'Unknown';
        const buttonId = button.id || button.className || 'no-id';

        this.trackEvent('button_click', {
          buttonText,
          buttonId,
          elementType: button.tagName.toLowerCase(),
          pageUrl: window.location.href,
        });
      }
    });

    // Track form field interactions
    document.addEventListener('focus', (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

      if (target.matches('input, textarea, select')) {
        this.trackEvent('form_field_focus', {
          fieldName: target.name || target.id || 'unnamed',
          fieldType: target.type || target.tagName.toLowerCase(),
          pageUrl: window.location.href,
        });
      }
    }, true);

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScrollDepth && scrollPercent <= 100) {
        maxScrollDepth = scrollPercent;

        // Track scroll milestones
        if (scrollPercent >= 25 && scrollPercent % 25 === 0) {
          this.trackEvent('scroll_milestone', {
            scrollDepth: scrollPercent,
            pageUrl: window.location.href,
          });
        }
      }
    });
  }

  private trackFormSubmissions(): void {
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const formFields: Record<string, string> = {};

      for (const [key, value] of formData.entries()) {
        formFields[key] = value.toString();
      }

      this.trackEvent('form_submit', {
        formId: form.id || form.className || 'unnamed-form',
        formFields: Object.keys(formFields),
        pageUrl: window.location.href,
      });
    });
  }

  private trackOutboundLinks(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href) {
        const url = new URL(link.href);

        // Check if it's an external link
        if (url.hostname !== window.location.hostname) {
          this.trackEvent('outbound_link_click', {
            linkUrl: link.href,
            linkText: link.textContent?.trim() || link.getAttribute('aria-label') || 'Unknown',
            pageUrl: window.location.href,
          });
        }
      }
    });
  }

  // Main tracking method
  trackEvent(eventType: string, eventData: Record<string, any>): void {
    const event: AttributionEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.userId,
      eventType,
      eventData,
      source: this.getSourceInfo(),
      device: this.getDeviceInfo(),
      location: this.getLocationInfo(),
    };

    this.events.push(event);

    // Keep only recent events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // Send to analytics services
    this.sendToAnalytics(event);

    // Save to storage
    this.saveToStorage();
  }

  private getSourceInfo() {
    const urlParams = new URLSearchParams(window.location.search);

    return {
      channel: this.detectChannel(),
      campaign: urlParams.get('utm_campaign') || undefined,
      referrer: document.referrer || undefined,
      landingPage: window.location.pathname,
    };
  }

  private detectChannel(): string {
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);

    // Direct traffic
    if (!referrer && !urlParams.has('utm_source')) {
      return 'direct';
    }

    // UTM parameters
    if (urlParams.has('utm_source')) {
      const source = urlParams.get('utm_source')!.toLowerCase();
      if (source.includes('google') || source.includes('bing') || source.includes('yahoo')) {
        return 'organic_search';
      }
      if (source.includes('facebook') || source.includes('instagram') || source.includes('twitter')) {
        return 'social_media';
      }
      if (source.includes('email') || source.includes('mail')) {
        return 'email';
      }
      return 'paid_search';
    }

    // Referrer-based detection
    if (referrer) {
      const referrerUrl = new URL(referrer);
      if (referrerUrl.hostname.includes('google.com')) return 'organic_search';
      if (referrerUrl.hostname.includes('facebook.com') || referrerUrl.hostname.includes('instagram.com')) {
        return 'social_media';
      }
      if (referrerUrl.hostname.includes('zillow.com') || referrerUrl.hostname.includes('realtor.com')) {
        return 'real_estate_portal';
      }
      return 'referral';
    }

    return 'unknown';
  }

  private getDeviceInfo() {
    const ua = navigator.userAgent;

    return {
      type: this.getDeviceType(),
      browser: this.getBrowser(ua),
      os: this.getOS(ua),
    };
  }

  private getDeviceType(): string {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  private getBrowser(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOS(ua: string): string {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getLocationInfo() {
    // In a real implementation, you'd use a geolocation service
    // For now, return undefined to avoid privacy concerns
    return undefined;
  }

  private sendToAnalytics(event: AttributionEvent): void {
    // Send to Google Analytics 4
    if (window.gtag) {
      window.gtag('event', event.eventType, {
        custom_parameter_1: event.sessionId,
        custom_parameter_2: event.source.channel,
        ...event.eventData,
      });
    }

    // Send to custom analytics endpoint (would be implemented on backend)
    console.log('Analytics Event:', event);
  }

  // Business Intelligence Methods
  getConversionFunnel(): ConversionFunnel {
    const events = this.events;

    return {
      awareness: events.filter(e => ['page_view', 'scroll_milestone'].includes(e.eventType)).length,
      interest: events.filter(e => ['button_click', 'form_field_focus'].includes(e.eventType)).length,
      consideration: events.filter(e => e.eventType === 'form_submit').length,
      intent: events.filter(e => e.eventData?.formId?.includes('contact')).length,
      purchase: events.filter(e => e.eventData?.conversion === true).length,
      retention: events.filter(e => e.eventType === 'user_login').length,
    };
  }

  getAttributionModel(): AttributionModel {
    const conversions = this.events.filter(e => e.eventData?.conversion === true);
    const model: AttributionModel = {
      firstTouch: {},
      lastTouch: {},
      multiTouch: {},
      timeDecay: {},
    };

    conversions.forEach(conversion => {
      const sessionEvents = this.events.filter(e =>
        e.sessionId === conversion.sessionId &&
        e.timestamp <= conversion.timestamp
      );

      if (sessionEvents.length > 0) {
        // First touch
        const firstEvent = sessionEvents[0];
        model.firstTouch[firstEvent.source.channel] =
          (model.firstTouch[firstEvent.source.channel] || 0) + 1;

        // Last touch
        const lastEvent = sessionEvents[sessionEvents.length - 1];
        model.lastTouch[lastEvent.source.channel] =
          (model.lastTouch[lastEvent.source.channel] || 0) + 1;

        // Multi-touch (equal weight)
        const uniqueChannels = [...new Set(sessionEvents.map(e => e.source.channel))];
        uniqueChannels.forEach(channel => {
          model.multiTouch[channel] =
            (model.multiTouch[channel] || 0) + (1 / uniqueChannels.length);
        });

        // Time decay (more recent events get more weight)
        sessionEvents.forEach((event, index) => {
          const weight = Math.exp(-(sessionEvents.length - 1 - index) * 0.5);
          model.timeDecay[event.source.channel] =
            (model.timeDecay[event.source.channel] || 0) + weight;
        });
      }
    });

    return model;
  }

  getChannelPerformance(): Record<string, {
    visits: number;
    conversions: number;
    conversionRate: number;
    avgSessionDuration: number;
  }> {
    const channels: Record<string, any> = {};

    this.events.forEach(event => {
      const channel = event.source.channel;

      if (!channels[channel]) {
        channels[channel] = {
          visits: 0,
          conversions: 0,
          sessionDurations: [],
          firstEventTime: event.timestamp,
          lastEventTime: event.timestamp,
        };
      }

      if (event.eventType === 'page_view') {
        channels[channel].visits++;
      }

      if (event.eventData?.conversion) {
        channels[channel].conversions++;
      }

      channels[channel].lastEventTime = event.timestamp;
    });

    // Calculate metrics
    Object.keys(channels).forEach(channel => {
      const data = channels[channel];
      const sessionDuration = data.lastEventTime.getTime() - data.firstEventTime.getTime();

      channels[channel] = {
        visits: data.visits,
        conversions: data.conversions,
        conversionRate: data.visits > 0 ? (data.conversions / data.visits) * 100 : 0,
        avgSessionDuration: sessionDuration / 1000, // in seconds
      };
    });

    return channels;
  }

  getUserJourney(sessionId: string): AttributionEvent[] {
    return this.events
      .filter(event => event.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  getTopPages(): Array<{ page: string; views: number; bounceRate: number }> {
    const pageStats: Record<string, { views: number; bounces: number }> = {};

    this.events.forEach(event => {
      if (event.eventType === 'page_view') {
        const page = event.eventData?.url || event.source.landingPage;

        if (!pageStats[page]) {
          pageStats[page] = { views: 0, bounces: 0 };
        }

        pageStats[page].views++;

        // Simple bounce detection: only one page view in session
        const sessionEvents = this.events.filter(e => e.sessionId === event.sessionId);
        if (sessionEvents.length === 1) {
          pageStats[page].bounces++;
        }
      }
    });

    return Object.entries(pageStats)
      .map(([page, stats]) => ({
        page,
        views: stats.views,
        bounceRate: stats.views > 0 ? (stats.bounces / stats.views) * 100 : 0,
      }))
      .sort((a, b) => b.views - a.views);
  }

  // Storage methods
  private saveToStorage(): void {
    try {
      const data = {
        events: this.events.slice(-1000), // Save last 1000 events
        sessionId: this.sessionId,
        userId: this.userId,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('enhanced-analytics-data', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save analytics data:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('enhanced-analytics-data');
      if (data) {
        const parsed = JSON.parse(data);
        this.events = parsed.events?.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp),
        })) || [];
        this.sessionId = parsed.sessionId || this.generateSessionId();
        this.userId = parsed.userId;
      }
    } catch (error) {
      console.warn('Failed to load analytics data:', error);
    }
  }

  // Public API
  setUserId(userId: string): void {
    this.userId = userId;
    this.saveToStorage();
  }

  trackConversion(value?: number, currency: string = 'USD'): void {
    this.trackEvent('conversion', {
      conversion: true,
      value,
      currency,
    });
  }

  getAnalyticsReport(): {
    conversionFunnel: ConversionFunnel;
    attributionModel: AttributionModel;
    channelPerformance: Record<string, any>;
    topPages: Array<{ page: string; views: number; bounceRate: number }>;
    totalEvents: number;
    uniqueSessions: number;
  } {
    return {
      conversionFunnel: this.getConversionFunnel(),
      attributionModel: this.getAttributionModel(),
      channelPerformance: this.getChannelPerformance(),
      topPages: this.getTopPages(),
      totalEvents: this.events.length,
      uniqueSessions: new Set(this.events.map(e => e.sessionId)).size,
    };
  }
}

// Singleton instance
export const enhancedAnalytics = new EnhancedAnalyticsEngine();

// Utility functions
export const trackConversion = (value?: number, currency?: string) => {
  enhancedAnalytics.trackConversion(value, currency);
};

export const setUserId = (userId: string) => {
  enhancedAnalytics.setUserId(userId);
};

export const getAnalyticsReport = () => {
  return enhancedAnalytics.getAnalyticsReport();
};

export const getUserJourney = (sessionId: string) => {
  return enhancedAnalytics.getUserJourney(sessionId);
};
