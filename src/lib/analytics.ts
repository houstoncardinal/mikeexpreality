// Google Analytics 4 Integration
// Replace with your actual GA4 Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Initialize GA4
export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  // Create script element for gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

// Track property views
export const trackPropertyView = (property: {
  id: string;
  address: string;
  price: number;
  type: string;
  city: string;
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'view_item', {
    currency: 'USD',
    value: property.price,
    items: [{
      item_id: property.id,
      item_name: property.address,
      item_category: property.type,
      item_category2: property.city,
      price: property.price,
    }],
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string, formData?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'generate_lead', {
    form_name: formName,
    ...formData,
  });
};

// Track CTA clicks
export const trackCTAClick = (ctaName: string, ctaLocation: string, destination?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'cta_click', {
    cta_name: ctaName,
    cta_location: ctaLocation,
    destination: destination,
  });
};

// Track lead conversions
export const trackLeadConversion = (leadType: string, leadValue?: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'conversion', {
    send_to: `${GA_MEASUREMENT_ID}/lead`,
    event_category: 'Lead',
    event_label: leadType,
    value: leadValue,
  });
};

// Track home valuation form
export const trackHomeValuation = (data: {
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'home_valuation_request', {
    property_address: data.address,
    property_city: data.city,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
  });
  
  // Also track as a lead conversion
  trackLeadConversion('home_valuation');
};

// Track contact form
export const trackContactForm = (source: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'contact_form_submission', {
    form_source: source,
  });
  
  trackLeadConversion('contact_inquiry');
};

// Track property inquiry
export const trackPropertyInquiry = (propertyId: string, propertyAddress: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'property_inquiry', {
    property_id: propertyId,
    property_address: propertyAddress,
  });
  
  trackLeadConversion('property_inquiry');
};

// Track phone call clicks
export const trackPhoneClick = (location: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'phone_call_click', {
    click_location: location,
  });
};

// Track email clicks
export const trackEmailClick = (location: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'email_click', {
    click_location: location,
  });
};

// Track virtual tour engagement
export const trackVirtualTour = (propertyId: string, tourType: 'video' | '3d_tour') => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'virtual_tour_engagement', {
    property_id: propertyId,
    tour_type: tourType,
  });
};

// Track mortgage calculator usage
export const trackMortgageCalculator = (propertyPrice: number, downPayment: number, loanTerm: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'mortgage_calculator_used', {
    property_price: propertyPrice,
    down_payment_percent: downPayment,
    loan_term_years: loanTerm,
  });
};
