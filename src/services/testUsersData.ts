import { 
  createUser, 
  createQuotation, 
  createProject,
  createService,
  ServicePackage,
  Quotation,
  Project,
  User
} from './firebaseService';

// Sample services data
const sampleServices: Omit<ServicePackage, 'id'>[] = [
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
  }
];

// Add-ons data
const sampleAddOns = [
  {
    id: 'addon-1',
    name: 'E-commerce Integration',
    description: 'Full shopping cart and payment gateway integration',
    price: 200
  },
  {
    id: 'addon-2',
    name: 'Custom CMS',
    description: 'Content management system for easy updates',
    price: 150
  },
  {
    id: 'addon-3',
    name: 'SEO Package',
    description: 'Comprehensive SEO optimization and keyword research',
    price: 100
  },
  {
    id: 'addon-4',
    name: 'Email Marketing Setup',
    description: 'Newsletter integration with email automation',
    price: 75
  }
];

/**
 * Initialize test users with complete sample data
 * This creates 3 test clients and 1 admin with quotations and projects
 */
export const initializeTestUsers = async () => {
  try {
    console.log('🚀 Starting test users initialization...');
    
    // First, seed services if they don't exist
    console.log('📦 Seeding services...');
    const services: ServicePackage[] = [];
    for (const service of sampleServices) {
      const created = await createService(service);
      services.push(created);
    }
    console.log(`✅ Created ${services.length} services`);

    // Test User 1: Active user with multiple quotations
    console.log('\n👤 Creating Test User 1...');
    const testUser1 = await createUser({
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      role: 'user'
    });
    
    // Create quotations for test user 1
    const quotation1 = await createQuotation({
      name: 'E-commerce Website',
      userId: testUser1.id,
      clientInfo: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567'
      },
      servicePackage: services[3], // Complete Website Package
      addOns: [sampleAddOns[0], sampleAddOns[2]], // E-commerce + SEO
      discount: 10,
      totalPrice: 1390, // 1200 + 200 + 100 - 10% discount
      status: 'approved',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    });

    const quotation2 = await createQuotation({
      name: 'Portfolio Website',
      userId: testUser1.id,
      clientInfo: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567'
      },
      servicePackage: services[1], // Web Design Standard
      addOns: [sampleAddOns[2]], // SEO
      discount: 5,
      totalPrice: 237.5, // 150 + 100 - 5% discount
      status: 'sent',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Create project for test user 1
    const project1 = await createProject({
      name: 'E-commerce Website Development',
      description: 'Full-featured online store with payment integration and inventory management',
      userId: testUser1.id,
      quotationId: quotation1.id,
      status: 'active',
      progress: 65,
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      nextMilestone: 'Payment Gateway Integration',
      nextPaymentDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
    });

    console.log(`✅ Created user: ${testUser1.name}`);
    console.log(`   - 2 quotations (1 approved, 1 sent)`);
    console.log(`   - 1 active project (65% complete)`);

    // Test User 2: New user with draft quotation
    console.log('\n👤 Creating Test User 2...');
    const testUser2 = await createUser({
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 234-5678',
      role: 'user'
    });

    const quotation3 = await createQuotation({
      name: 'Social Media Campaign',
      userId: testUser2.id,
      clientInfo: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1 (555) 234-5678'
      },
      servicePackage: services[5], // Social Media Growth
      addOns: [sampleAddOns[3]], // Email Marketing
      discount: 0,
      totalPrice: 675, // 600 + 75
      status: 'draft',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    });

    console.log(`✅ Created user: ${testUser2.name}`);
    console.log(`   - 1 draft quotation`);

    // Test User 3: User with completed project
    console.log('\n👤 Creating Test User 3...');
    const testUser3 = await createUser({
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 345-6789',
      role: 'user'
    });

    const quotation4 = await createQuotation({
      name: 'Corporate Website Redesign',
      userId: testUser3.id,
      clientInfo: {
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+1 (555) 345-6789'
      },
      servicePackage: services[2], // Web Design Premium
      addOns: [sampleAddOns[1], sampleAddOns[2]], // CMS + SEO
      discount: 15,
      totalPrice: 637.5, // 500 + 150 + 100 - 15% discount
      status: 'approved',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
    });

    const project2 = await createProject({
      name: 'Corporate Website Redesign',
      description: 'Modern, professional website with custom CMS and SEO optimization',
      userId: testUser3.id,
      quotationId: quotation4.id,
      status: 'completed',
      progress: 100,
      startDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      nextMilestone: 'Project Completed',
      nextPaymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    });

    const project3 = await createProject({
      name: 'Website Maintenance',
      description: 'Ongoing website maintenance and updates',
      userId: testUser3.id,
      status: 'pending',
      progress: 0,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      nextMilestone: 'Initial Setup',
      nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    console.log(`✅ Created user: ${testUser3.name}`);
    console.log(`   - 1 approved quotation`);
    console.log(`   - 2 projects (1 completed, 1 pending)`);

    // Admin User
    console.log('\n👤 Creating Admin User...');
    const adminUser = await createUser({
      name: 'Admin User',
      email: 'admin@toiral.com',
      phone: '+1 (555) 000-0000',
      role: 'admin'
    });

    console.log(`✅ Created admin user: ${adminUser.name}`);

    console.log('\n✨ Test users initialization completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - 3 test client users created');
    console.log('   - 1 admin user created');
    console.log('   - 4 quotations created (various statuses)');
    console.log('   - 3 projects created (various statuses)');
    console.log('   - 6 service packages created');
    
    console.log('\n🔑 Test Access Codes:');
    console.log('   - Admin: "admin"');
    console.log('   - Test Client 1 (John): "testuser1"');
    console.log('   - Test Client 2 (Sarah): "testuser2"');
    console.log('   - Test Client 3 (Michael): "testuser3"');

    return {
      success: true,
      users: {
        admin: adminUser,
        testUser1,
        testUser2,
        testUser3
      },
      services,
      quotations: [quotation1, quotation2, quotation3, quotation4],
      projects: [project1, project2, project3]
    };
  } catch (error) {
    console.error('❌ Error initializing test users:', error);
    throw error;
  }
};

/**
 * Get test user credentials for documentation
 */
export const getTestCredentials = () => {
  return [
    {
      role: 'Admin',
      accessCode: 'admin',
      name: 'Admin User',
      description: 'Full admin access with analytics and user management'
    },
    {
      role: 'Client',
      accessCode: 'testuser1',
      name: 'John Smith',
      description: 'Active user with approved quotation and ongoing project (65% complete)'
    },
    {
      role: 'Client',
      accessCode: 'testuser2',
      name: 'Sarah Johnson',
      description: 'New user with draft quotation'
    },
    {
      role: 'Client',
      accessCode: 'testuser3',
      name: 'Michael Chen',
      description: 'User with completed project and pending project'
    }
  ];
};
