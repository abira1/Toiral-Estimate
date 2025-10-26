import { createService, ServicePackage } from './firebaseService';

// Comprehensive service packages with all categories
const comprehensiveServices: Omit<ServicePackage, 'id'>[] = [
  // ============================================
  // WEB & APP DESIGN PACKAGES
  // ============================================
  {
    category: 'Web & App Design',
    name: 'Basic',
    price: 60,
    description: 'Single-page website or app design, responsive layout.',
    features: [
      'Single-page website or app design',
      'Responsive layout for all devices',
      '1 revision',
      'Delivery of design in PNG/JPG'
    ],
    deliveryTime: 5
  },
  {
    category: 'Web & App Design',
    name: 'Standard',
    price: 150,
    description: 'Up to 5 pages/screens with interactive prototype and brand-focused UI.',
    features: [
      'Up to 5 pages/screens',
      'Brand-focused UI/UX design',
      'Interactive clickable prototype',
      '3 revisions',
      'Delivery in PNG, JPG, and Figma/Adobe XD'
    ],
    deliveryTime: 10
  },
  {
    category: 'Web & App Design',
    name: 'Premium',
    price: 500,
    description: 'For large organizations with unlimited pages and design system.',
    features: [
      'Complete website/app design (unlimited pages/screens)',
      'Detailed design system (colors, typography, buttons, icons)',
      'Unlimited revisions',
      'Interactive prototype with animations',
      'Delivery in all source files (Figma/Adobe XD)'
    ],
    deliveryTime: 20
  },

  // ============================================
  // COMPLETE WEBSITE PACKAGES
  // ============================================
  {
    category: 'Complete Website Package',
    name: 'Basic',
    price: 110,
    description: 'Perfect for small businesses starting online.',
    features: [
      'Up to 5 pages (Home, About, Services, Contact, etc.)',
      'Free custom design',
      'Mobile & tablet responsive',
      'Hosting & domain setup',
      '1 month support'
    ],
    deliveryTime: 14
  },
  {
    category: 'Complete Website Package',
    name: 'Standard',
    price: 670,
    description: 'For growing businesses that need control & flexibility.',
    features: [
      'Up to 10 pages',
      'Free custom design',
      'Admin panel / CMS integration',
      'SEO setup & basic optimization',
      '3 months support & updates'
    ],
    deliveryTime: 21
  },
  {
    category: 'Complete Website Package',
    name: 'Premium',
    price: 980,
    description: 'Complete solution for businesses that need advanced functionality.',
    features: [
      'Unlimited Pages',
      'Free custom design',
      'E-commerce / Booking system / Custom features',
      'Full SEO & performance optimization',
      'Secure backend & database integration',
      'Progressive Web App (PWA) support',
      '6 months support + priority updates'
    ],
    deliveryTime: 30
  },

  // ============================================
  // SOCIAL MEDIA PACKAGES
  // ============================================
  {
    category: 'Social Media Management',
    name: 'Basic Package',
    price: 110,
    description: 'Best for small cafes or startups who want consistent online activity.',
    features: [
      '100 custom image posts (Facebook & Instagram)',
      'Captions & hashtag research',
      'Basic post scheduling',
      'Organic growth support',
      'Monthly performance report'
    ],
    deliveryTime: 30
  },
  {
    category: 'Social Media Management',
    name: 'Standard Package',
    price: 200,
    description: 'Perfect for growing businesses aiming for balance of creativity and reach.',
    features: [
      '100 image posts + 10 short videos (reels)',
      'Creative caption writing & hashtag strategy',
      'Content calendar planning',
      'Follower growth and engagement strategy',
      '1 ad campaign setup & monitoring',
      'Monthly analytics and insights report'
    ],
    deliveryTime: 30
  },
  {
    category: 'Social Media Management',
    name: 'Premium Package',
    price: 320,
    description: 'Ideal for brands ready to scale and establish strong visual identity.',
    features: [
      '100 image posts + 1 long documentary video + 15 Reels',
      'Full creative direction & content strategy',
      'Campaign management (ads + organic)',
      'Food/product photography & editing',
      'Brand-focused captioning and storytelling',
      'Growth analysis, competitor insights, and audience targeting',
      'Weekly performance and improvement reports'
    ],
    deliveryTime: 30
  },

  // ============================================
  // MOBILE APP DEVELOPMENT PACKAGES
  // ============================================
  {
    category: 'Mobile App Development',
    name: 'Basic',
    price: 1500,
    description: 'Simple mobile app with essential features for iOS or Android.',
    features: [
      'Single platform (iOS or Android)',
      'Up to 5 screens',
      'Basic UI/UX design',
      'User authentication',
      'Push notifications',
      'Backend integration',
      '2 months support'
    ],
    deliveryTime: 45
  },
  {
    category: 'Mobile App Development',
    name: 'Standard',
    price: 2800,
    description: 'Cross-platform mobile app with advanced features.',
    features: [
      'Both iOS and Android platforms',
      'Up to 15 screens',
      'Custom UI/UX design',
      'Advanced authentication (social login)',
      'API integration',
      'Payment gateway integration',
      'Admin panel',
      'App Store deployment assistance',
      '4 months support'
    ],
    deliveryTime: 60
  },
  {
    category: 'Mobile App Development',
    name: 'Premium',
    price: 5000,
    description: 'Enterprise-grade mobile app with unlimited features.',
    features: [
      'iOS, Android, and Web platforms',
      'Unlimited screens',
      'Premium UI/UX with animations',
      'Real-time features (chat, notifications)',
      'Advanced backend with database',
      'Payment & subscription systems',
      'Analytics and reporting dashboard',
      'Third-party integrations',
      'App Store optimization',
      '12 months support + priority updates'
    ],
    deliveryTime: 90
  },

  // ============================================
  // E-COMMERCE SOLUTIONS
  // ============================================
  {
    category: 'E-Commerce Solutions',
    name: 'Basic',
    price: 800,
    description: 'Starter online store with essential e-commerce features.',
    features: [
      'Up to 50 products',
      'Product catalog with categories',
      'Shopping cart & checkout',
      'Payment gateway integration',
      'Order management',
      'Mobile responsive design',
      'Basic SEO setup',
      '2 months support'
    ],
    deliveryTime: 20
  },
  {
    category: 'E-Commerce Solutions',
    name: 'Standard',
    price: 1800,
    description: 'Professional online store with advanced features.',
    features: [
      'Up to 500 products',
      'Advanced product filtering',
      'Multiple payment gateways',
      'Inventory management',
      'Customer accounts & wishlists',
      'Discount codes & promotions',
      'Email marketing integration',
      'Analytics dashboard',
      'Full SEO optimization',
      '4 months support'
    ],
    deliveryTime: 35
  },
  {
    category: 'E-Commerce Solutions',
    name: 'Premium',
    price: 3500,
    description: 'Enterprise e-commerce platform with unlimited capabilities.',
    features: [
      'Unlimited products',
      'Multi-vendor marketplace support',
      'Advanced shipping integrations',
      'Multi-currency & multi-language',
      'Subscription & recurring payments',
      'Advanced analytics & reporting',
      'Customer loyalty programs',
      'AI-powered product recommendations',
      'Custom integrations (ERP, CRM)',
      'Priority support for 12 months'
    ],
    deliveryTime: 60
  },

  // ============================================
  // SEO & DIGITAL MARKETING
  // ============================================
  {
    category: 'SEO & Digital Marketing',
    name: 'Basic',
    price: 400,
    description: 'Essential SEO setup for new websites.',
    features: [
      'Website SEO audit',
      'Keyword research (up to 20 keywords)',
      'On-page optimization',
      'Meta tags optimization',
      'Google Search Console setup',
      'Google Analytics setup',
      'Monthly performance report'
    ],
    deliveryTime: 15
  },
  {
    category: 'SEO & Digital Marketing',
    name: 'Standard',
    price: 900,
    description: 'Comprehensive SEO and content marketing strategy.',
    features: [
      'Advanced SEO audit',
      'Keyword research (up to 50 keywords)',
      'Complete on-page & technical SEO',
      'Content strategy & blog planning',
      'Link building (10 quality backlinks/month)',
      'Local SEO optimization',
      'Competitor analysis',
      'Google My Business optimization',
      'Bi-weekly performance reports'
    ],
    deliveryTime: 30
  },
  {
    category: 'SEO & Digital Marketing',
    name: 'Premium',
    price: 2000,
    description: 'Full-scale digital marketing campaign with paid advertising.',
    features: [
      'Enterprise SEO strategy',
      'Unlimited keyword targeting',
      'Advanced technical SEO',
      'Content creation (8 blog posts/month)',
      'Link building (25 quality backlinks/month)',
      'Google Ads campaign management',
      'Social media advertising',
      'Conversion rate optimization',
      'A/B testing & optimization',
      'Dedicated account manager',
      'Weekly detailed analytics reports'
    ],
    deliveryTime: 30
  },

  // ============================================
  // BRANDING & LOGO DESIGN
  // ============================================
  {
    category: 'Branding & Logo Design',
    name: 'Basic',
    price: 200,
    description: 'Simple logo design for startups.',
    features: [
      '3 logo concepts',
      '2 revisions',
      'High-resolution files (PNG, JPG)',
      'Social media kit',
      'Color palette guide'
    ],
    deliveryTime: 7
  },
  {
    category: 'Branding & Logo Design',
    name: 'Standard',
    price: 500,
    description: 'Complete brand identity package.',
    features: [
      '5 logo concepts',
      'Unlimited revisions',
      'Full brand identity guide',
      'Business card design',
      'Letterhead & envelope design',
      'Social media templates',
      'All source files included',
      'Brand style guide document'
    ],
    deliveryTime: 14
  },
  {
    category: 'Branding & Logo Design',
    name: 'Premium',
    price: 1200,
    description: 'Enterprise branding with comprehensive brand strategy.',
    features: [
      'Unlimited logo concepts',
      'Complete brand strategy workshop',
      'Brand positioning & messaging',
      'Full brand identity system',
      'Marketing collateral design (brochures, flyers)',
      'Packaging design concepts',
      'Brand guidelines document',
      'Presentation templates',
      '3 months brand consultation',
      'Trademark filing assistance'
    ],
    deliveryTime: 30
  }
];

// Add-ons that users can purchase to customize their packages
export const defaultAddOns = [
  {
    id: 'addon-rush-delivery',
    name: 'Rush Delivery',
    description: 'Expedite project delivery by 50%',
    price: 200,
    category: 'Delivery',
    applicableToCategories: ['all']
  },
  {
    id: 'addon-extra-revision',
    name: 'Extra Revisions',
    description: '+5 additional revision rounds',
    price: 100,
    category: 'Revisions',
    applicableToCategories: ['Web & App Design', 'Branding & Logo Design']
  },
  {
    id: 'addon-maintenance',
    name: 'Extended Maintenance',
    description: '6 additional months of support & maintenance',
    price: 300,
    category: 'Support',
    applicableToCategories: ['Complete Website Package', 'Mobile App Development', 'E-Commerce Solutions']
  },
  {
    id: 'addon-multilingual',
    name: 'Multi-language Support',
    description: 'Add support for 2 additional languages',
    price: 400,
    category: 'Features',
    applicableToCategories: ['Complete Website Package', 'E-Commerce Solutions']
  },
  {
    id: 'addon-seo-boost',
    name: 'SEO Boost Package',
    description: 'Advanced SEO optimization for 3 months',
    price: 500,
    category: 'Marketing',
    applicableToCategories: ['Complete Website Package', 'E-Commerce Solutions']
  },
  {
    id: 'addon-training',
    name: 'Training Session',
    description: '2-hour training session for your team',
    price: 150,
    category: 'Training',
    applicableToCategories: ['all']
  },
  {
    id: 'addon-content-writing',
    name: 'Professional Content Writing',
    description: 'SEO-optimized content for up to 10 pages',
    price: 250,
    category: 'Content',
    applicableToCategories: ['Complete Website Package', 'E-Commerce Solutions']
  },
  {
    id: 'addon-photography',
    name: 'Professional Photography',
    description: '1-day product/business photography session',
    price: 600,
    category: 'Photography',
    applicableToCategories: ['Social Media Management', 'E-Commerce Solutions']
  }
];

export const seedComprehensiveServices = async () => {
  try {
    console.log('Starting to seed comprehensive services...');
    for (const service of comprehensiveServices) {
      await createService(service);
      console.log(`Created service: ${service.category} - ${service.name}`);
    }
    console.log('All services seeded successfully!');
  } catch (error) {
    console.error('Failed to seed services:', error);
    throw error;
  }
};
