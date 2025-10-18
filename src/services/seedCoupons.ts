import { createCoupon } from './workflowService';
import { Coupon } from '../types/workflow';

export const createSampleCoupons = async (): Promise<void> => {
  const sampleCoupons: Omit<Coupon, 'id' | 'usedCount'>[] = [
    {
      code: 'WELCOME10',
      discount: 10,
      discountType: 'percentage',
      description: 'Welcome discount - 10% off your first project',
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
      minOrderAmount: 100,
      usageLimit: 100,
      isActive: true
    },
    {
      code: 'SUMMER20',
      discount: 20,
      discountType: 'percentage', 
      description: 'Summer special - 20% off all projects',
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
      minOrderAmount: 200,
      usageLimit: 50,
      isActive: true
    },
    {
      code: 'SAVE50',
      discount: 50,
      discountType: 'fixed',
      description: 'Fixed $50 discount on orders over $300',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      minOrderAmount: 300,
      usageLimit: 25,
      isActive: true
    },
    {
      code: 'EARLYBIRD',
      discount: 15,
      discountType: 'percentage',
      description: 'Early bird discount - 15% off for quick starters',
      validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
      minOrderAmount: 150,
      usageLimit: 75,
      isActive: true
    },
    {
      code: 'VIP25',
      discount: 25,
      discountType: 'percentage',
      description: 'VIP customer discount - 25% off premium projects',
      validUntil: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days from now
      minOrderAmount: 500,
      usageLimit: 20,
      isActive: true
    }
  ];

  try {
    for (const couponData of sampleCoupons) {
      await createCoupon(couponData);
    }
    console.log('✅ Sample coupons created successfully');
  } catch (error) {
    console.error('❌ Error creating sample coupons:', error);
  }
};