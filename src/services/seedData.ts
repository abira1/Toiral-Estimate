import { createService, ServicePackage } from './firebaseService';

const defaultServices: Omit<ServicePackage, 'id'>[] = [
  // Web & App Design
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
    ]
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
    ]
  },
  {
    category: 'Web & App Design',
    name: 'Premium',
    price: 500,
    description: 'For large organizations with complex design needs.',
    features: [
      'Complete website/app design (unlimited pages/screens)',
      'Detailed design system (colors, typography, buttons, icons)',
      'Unlimited revisions',
      'Interactive prototype with animations',
      'Delivery in all source files (Figma/Adobe XD)'
    ]
  },
  // Complete Website Package
  {
    category: 'Complete Website Package',
    name: 'Complete Website',
    price: 1200,
    description: 'All-in-one solution for businesses that want to establish a strong online presence.',
    features: [
      'Custom design',
      'Full-stack development',
      'SEO optimization',
      'Hosting setup',
      'Content management system',
      'Mobile responsive',
      '30 days of support',
      'Analytics integration'
    ]
  },
  // Social Media Packages
  {
    category: 'Social Media',
    name: 'Starter',
    price: 300,
    description: 'Perfect for businesses just beginning their social media journey.',
    features: [
      '8 posts per month',
      'Basic image creation',
      'Caption writing',
      'Monthly performance report'
    ]
  },
  {
    category: 'Social Media',
    name: 'Growth',
    price: 600,
    description: 'For businesses ready to expand their social media presence.',
    features: [
      '15 posts per month',
      'Advanced image and video creation',
      'Engagement strategy',
      'Hashtag research',
      'Bi-weekly performance reports'
    ]
  },
  {
    category: 'Social Media',
    name: 'Professional',
    price: 1200,
    description: 'Comprehensive management for established brands.',
    features: [
      '30 posts per month',
      'Premium content creation',
      'Story and Reel creation',
      'Community management',
      'Influencer outreach',
      'Weekly performance reports'
    ]
  }
];

export const seedServices = async () => {
  try {
    for (const service of defaultServices) {
      await createService(service);
    }
    console.log('Services seeded successfully');
  } catch (error) {
    console.error('Failed to seed services:', error);
  }
};
