/**
 * Centralized image management system
 * Professional images for Mike Ogunkeye Real Estate
 * All images imported from /public folder
 */

// Mike's professional images
export const mikeImages = {
  // Primary professional headshot (300x300 JPEG - optimized)
  profile: '/imgi_8_850ed524-fbef-4776-b1d2-b1b958fbde94.jpeg',

  // Alternative professional images
  profileAlt1: '/imgi_3_278de477-71c0-485e-83bf-73a52478c40f.png', // 1157x601 PNG
  profileAlt2: '/imgi_7_3e061cc4-19fe-4964-9802-0ef4ec5783d2.jpeg',

  // Brand logo (390x140 PNG)
  logo: '/imgi_35_b517d231-d9f5-4e15-870d-852a977c9204.png',
};

// Luxury property images (all from /public folder)
export const propertyImages = {
  // Featured luxury estates (high-quality images)
  luxury1: '/imgi_125_20190322153144208228000000-o.jpg', // 581K
  luxury2: '/imgi_22_-3680443779631392670.jpg', // 982K
  luxury3: '/imgi_18_8564039198595028051.jpg', // 876K
  luxury4: '/imgi_14_1887428145382298790.jpg', // 799K
  luxury5: '/imgi_20_6008241602089556706.jpg', // 741K
  luxury6: '/imgi_17_-5243027874929875930.jpg', // 642K
  luxury7: '/imgi_19_-1281652502502408257.jpg', // 557K

  // Modern contemporary homes
  modern1: '/imgi_13_-3252337621568236283.jpg', // 516K
  modern2: '/imgi_9_-7106235475037492513.jpg', // 302K
  modern3: '/imgi_21_-4979929816751632401.jpg', // 336K

  // Property exteriors
  exterior1: '/imgi_16_-8442027838136868696.jpg', // 148K
  exterior2: '/imgi_10_7120993268281597033.jpg', // 655K

  // Additional property images
  property1: '/imgi_12_-7189515740131590123.jpg', // 13K - small thumbnail
};

// Background and hero images
export const heroImages = {
  home: '/src/assets/hero-home.jpg',
  listing1: '/src/assets/listing-1.jpg',
  listing2: '/src/assets/listing-2.jpg',
  listing3: '/src/assets/listing-3.jpg',
};

// Brand and certification images (all from /public folder)
export const brandImages = {
  // Official Realtor & Equal Housing Opportunity Logo (WebP)
  realtorLogo: '/imgi_34_realtor-eho-logo-07232021-update-light.webp',

  // Professional certifications and badges
  certification1: '/imgi_120_5790e188-0ef9-47ea-9126-068fbac0eb7c.webp',
  certification2: '/imgi_39_3e061cc4-19fe-4964-9802-0ef4ec5783d2.webp',
  certification3: '/imgi_38_a8a39dab-73b2-45e6-9158-d7c58ec33a4d.webp',
  certification4: '/imgi_36_1e4e1933-4b03-4967-83e2-5c202eb662d7.webp',

  // Mike's logo/brand
  mikeLogo: '/imgi_35_b517d231-d9f5-4e15-870d-852a977c9204.png',
};

// Get optimized image for different contexts
export function getOptimizedImage(type: 'profile' | 'property' | 'hero' | 'brand', variant?: string): string {
  switch (type) {
    case 'profile':
      return variant === 'alt1' ? mikeImages.profileAlt1 :
             variant === 'alt2' ? mikeImages.profileAlt2 :
             mikeImages.profile;

    case 'property':
      const propertyKeys = Object.keys(propertyImages);
      const randomKey = variant || propertyKeys[Math.floor(Math.random() * propertyKeys.length)];
      return propertyImages[randomKey as keyof typeof propertyImages] || propertyImages.luxury1;

    case 'hero':
      return heroImages.home;

    case 'brand':
      return brandImages.realtorLogo;

    default:
      return mikeImages.profile;
  }
}

// Preload critical images for better performance
export function preloadCriticalImages() {
  const critical = [
    mikeImages.profile,
    heroImages.home,
    propertyImages.luxury1,
    propertyImages.luxury2,
    propertyImages.luxury3,
  ];

  critical.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Image with fallback
export function getImageWithFallback(primarySrc: string, fallbackSrc?: string): string {
  return primarySrc || fallbackSrc || mikeImages.profile;
}
