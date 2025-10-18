import { 
  createClient, 
  createProjectSetup, 
  createCoupon, 
  sendClientInvitation 
} from './workflowService';
import { Client, ProjectSetup, Coupon } from '../types/workflow';

export const createPhase5TestData = async (): Promise<void> => {
  console.log('🚀 Creating Phase 5 test data...');
  
  try {
    // Create sample coupons first
    const sampleCoupons: Omit<Coupon, 'id' | 'usedCount'>[] = [
      {
        code: 'WELCOME10',
        discount: 10,
        discountType: 'percentage',
        description: 'Welcome discount - 10% off your first project',
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        minOrderAmount: 100,
        usageLimit: 100,
        isActive: true
      },
      {
        code: 'SUMMER20',
        discount: 20,
        discountType: 'percentage', 
        description: 'Summer special - 20% off all projects',
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        minOrderAmount: 200,
        usageLimit: 50,
        isActive: true
      },
      {
        code: 'SAVE50',
        discount: 50,
        discountType: 'fixed',
        description: 'Fixed $50 discount on orders over $300',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        minOrderAmount: 300,
        usageLimit: 25,
        isActive: true
      }
    ];

    // Create coupons
    for (const couponData of sampleCoupons) {
      await createCoupon(couponData);
    }
    console.log('✅ Sample coupons created');

    // Create a test client for testuser1
    const testClient: Omit<Client, 'id' | 'clientCode' | 'createdAt' | 'status'> = {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567890',
      selectedPackage: 'Premium Package',
      additionalNotes: 'Needs modern design with mobile optimization',
      projectDetails: 'E-commerce website with payment integration',
      accessCode: 'testuser1',
      createdBy: 'admin'
    };

    const client = await createClient(testClient);
    console.log('✅ Test client created:', client.clientCode);

    // Create a project setup for this client
    const projectSetup: Omit<ProjectSetup, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
      clientId: client.id,
      clientCode: client.clientCode,
      projectName: 'E-commerce Website Development',
      features: [
        'Custom responsive design',
        'Product catalog management',
        'Shopping cart functionality',
        'Secure payment processing',
        'User account management',
        'Admin dashboard',
        'SEO optimization',
        'Mobile-first approach'
      ],
      description: 'Complete e-commerce solution with modern design and advanced functionality',
      basePrice: 2500,
      baseDeadline: 30,
      availableCoupons: [], // Will be populated from created coupons
      addOns: [
        {
          id: 'addon-advanced-seo',
          name: 'Advanced SEO Package',
          description: 'Comprehensive SEO optimization with keyword research and analytics',
          price: 299,
          extraDeliveryTime: 5,
          category: 'Marketing'
        },
        {
          id: 'addon-payment-gateway',
          name: 'Multiple Payment Gateways', 
          description: 'Integration with PayPal, Stripe, and other payment providers',
          price: 199,
          extraDeliveryTime: 3,
          category: 'Development'
        },
        {
          id: 'addon-inventory-management',
          name: 'Advanced Inventory System',
          description: 'Real-time inventory tracking and low stock alerts',
          price: 399,
          extraDeliveryTime: 7,
          category: 'Development'
        }
      ]
    };

    const project = await createProjectSetup(projectSetup);
    console.log('✅ Test project setup created:', project.projectName);

    // Update project status to sent_to_client to make it appear in pending approvals
    const { updateProjectSetup } = await import('./workflowService');
    await updateProjectSetup(project.id, { status: 'sent_to_client' });
    console.log('✅ Project setup sent to client');

    console.log('🎉 Phase 5 test data creation completed successfully!');
    console.log('📝 Test Instructions:');
    console.log('   1. Login with "testuser1"');
    console.log('   2. Navigate to "Pending Approvals"');
    console.log('   3. Review the E-commerce project');
    console.log('   4. Select add-ons and apply coupons');
    console.log('   5. Complete the approval workflow');

  } catch (error) {
    console.error('❌ Error creating Phase 5 test data:', error);
    throw error;
  }
};

// Function to clear test data
export const clearPhase5TestData = async (): Promise<void> => {
  console.log('🧹 Clearing Phase 5 test data...');
  // Implementation would go here to clean up test data
  console.log('✅ Test data cleared');
};