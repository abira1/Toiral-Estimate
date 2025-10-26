import { ref, set, get, update, push, remove } from 'firebase/database';
import { database } from '../config/firebase';
import { 
  UserPackageAssignment, 
  PackageAssignmentRequest, 
  PaymentMilestone,
  ProjectMilestone,
  PackageAddOn
} from '../types/packages';
import { getAllServices } from './firebaseService';

// Create a new package assignment
export const createPackageAssignment = async (
  request: PackageAssignmentRequest,
  createdBy: string
): Promise<UserPackageAssignment[]> => {
  const assignments: UserPackageAssignment[] = [];
  const services = await getAllServices();

  for (const packageReq of request.packages) {
    const service = services.find(s => s.id === packageReq.packageId);
    if (!service) continue;

    // Get add-ons
    const selectedAddOns: PackageAddOn[] = [];
    let addOnsTotal = 0;
    if (packageReq.addOns && packageReq.addOns.length > 0) {
      const addOnsData = await getAddOns();
      packageReq.addOns.forEach(addOnId => {
        const addOn = addOnsData.find(a => a.id === addOnId);
        if (addOn) {
          selectedAddOns.push({ ...addOn, selected: true });
          addOnsTotal += addOn.price;
        }
      });
    }

    const totalPrice = service.price + addOnsTotal;

    // Create payment milestones
    const paymentMilestones: PaymentMilestone[] = [];
    const percentages = request.paymentStructure.percentages;
    let currentDate = new Date();
    
    percentages.forEach((percentage, index) => {
      const milestoneDate = new Date(currentDate);
      milestoneDate.setDate(milestoneDate.getDate() + (index * 30)); // 30 days apart
      
      paymentMilestones.push({
        id: `payment-${index + 1}`,
        name: `Payment ${index + 1} (${percentage}%)`,
        percentage,
        amount: (totalPrice * percentage) / 100,
        dueDate: milestoneDate.toISOString(),
        status: index === 0 ? 'pending' : 'pending'
      });
    });

    // Create project milestones based on delivery time
    const projectMilestones: ProjectMilestone[] = [];
    const deliveryDays = service.deliveryTime || 30;
    const milestoneCount = Math.max(3, Math.ceil(deliveryDays / 10));
    const weightPerMilestone = 100 / milestoneCount;

    for (let i = 0; i < milestoneCount; i++) {
      const daysOffset = Math.ceil((deliveryDays / milestoneCount) * (i + 1));
      const milestoneDate = new Date();
      milestoneDate.setDate(milestoneDate.getDate() + daysOffset);

      projectMilestones.push({
        id: `milestone-${i + 1}`,
        name: `Milestone ${i + 1}`,
        description: i === 0 ? 'Project kickoff and planning' :
                     i === milestoneCount - 1 ? 'Final delivery and review' :
                     `Development phase ${i}`,
        dueDate: milestoneDate.toISOString(),
        status: 'pending',
        weight: weightPerMilestone
      });
    }

    // Calculate expected completion date
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + deliveryDays);

    const assignmentRef = push(ref(database, 'packageAssignments'));
    const assignmentId = assignmentRef.key!;

    const assignment: UserPackageAssignment = {
      id: assignmentId,
      userId: request.userId,
      userName: request.userName,
      userEmail: request.userEmail,
      packageId: service.id,
      packageCategory: service.category,
      packageName: service.name,
      packageDescription: service.description,
      basePrice: service.price,
      selectedAddOns,
      totalPrice,
      progress: 0,
      status: 'assigned',
      projectMilestones,
      paymentMilestones,
      totalPaid: 0,
      remainingBalance: totalPrice,
      nextPaymentDue: paymentMilestones[0].dueDate,
      nextPaymentAmount: paymentMilestones[0].amount,
      assignedDate: new Date().toISOString(),
      startDate: request.startDate,
      expectedCompletionDate: completionDate.toISOString(),
      notes: request.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy
    };

    await set(assignmentRef, assignment);
    assignments.push(assignment);
  }

  return assignments;
};

// Get all package assignments for a user
export const getUserPackageAssignments = async (userId: string): Promise<UserPackageAssignment[]> => {
  const assignmentsRef = ref(database, 'packageAssignments');
  const snapshot = await get(assignmentsRef);
  
  if (!snapshot.exists()) return [];
  
  const assignmentsObj = snapshot.val();
  const assignments: UserPackageAssignment[] = Object.values(assignmentsObj);
  
  return assignments.filter(a => a.userId === userId);
};

// Get all package assignments (admin view)
export const getAllPackageAssignments = async (): Promise<UserPackageAssignment[]> => {
  const assignmentsRef = ref(database, 'packageAssignments');
  const snapshot = await get(assignmentsRef);
  
  if (!snapshot.exists()) return [];
  
  const assignmentsObj = snapshot.val();
  return Object.values(assignmentsObj);
};

// Update package assignment
export const updatePackageAssignment = async (
  assignmentId: string,
  updates: Partial<UserPackageAssignment>
): Promise<void> => {
  const assignmentRef = ref(database, `packageAssignments/${assignmentId}`);
  await update(assignmentRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

// Update project milestone
export const updateProjectMilestone = async (
  assignmentId: string,
  milestoneId: string,
  status: 'pending' | 'in_progress' | 'completed'
): Promise<void> => {
  const assignmentRef = ref(database, `packageAssignments/${assignmentId}`);
  const snapshot = await get(assignmentRef);
  
  if (!snapshot.exists()) throw new Error('Assignment not found');
  
  const assignment: UserPackageAssignment = snapshot.val();
  const milestones = assignment.projectMilestones.map(m => {
    if (m.id === milestoneId) {
      return {
        ...m,
        status,
        completedDate: status === 'completed' ? new Date().toISOString() : m.completedDate
      };
    }
    return m;
  });

  // Calculate progress based on completed milestones
  const completedWeight = milestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + m.weight, 0);

  await update(assignmentRef, {
    projectMilestones: milestones,
    progress: Math.round(completedWeight),
    status: completedWeight >= 100 ? 'completed' : assignment.status === 'assigned' ? 'in_progress' : assignment.status,
    actualCompletionDate: completedWeight >= 100 ? new Date().toISOString() : assignment.actualCompletionDate,
    updatedAt: new Date().toISOString()
  });
};

// Record payment
export const recordPayment = async (
  assignmentId: string,
  milestoneId: string,
  amount: number
): Promise<void> => {
  const assignmentRef = ref(database, `packageAssignments/${assignmentId}`);
  const snapshot = await get(assignmentRef);
  
  if (!snapshot.exists()) throw new Error('Assignment not found');
  
  const assignment: UserPackageAssignment = snapshot.val();
  
  const milestones = assignment.paymentMilestones.map(m => {
    if (m.id === milestoneId) {
      return {
        ...m,
        status: 'paid' as const,
        paidDate: new Date().toISOString(),
        paidAmount: amount
      };
    }
    return m;
  });

  const totalPaid = assignment.totalPaid + amount;
  const remainingBalance = assignment.totalPrice - totalPaid;
  
  // Find next pending payment
  const nextPayment = milestones.find(m => m.status === 'pending');

  await update(assignmentRef, {
    paymentMilestones: milestones,
    totalPaid,
    remainingBalance,
    nextPaymentDue: nextPayment?.dueDate,
    nextPaymentAmount: nextPayment?.amount,
    updatedAt: new Date().toISOString()
  });
};

// Add add-on to existing package
export const addAddOnToPackage = async (
  assignmentId: string,
  addOnId: string
): Promise<void> => {
  const assignmentRef = ref(database, `packageAssignments/${assignmentId}`);
  const snapshot = await get(assignmentRef);
  
  if (!snapshot.exists()) throw new Error('Assignment not found');
  
  const assignment: UserPackageAssignment = snapshot.val();
  const addOnsData = await getAddOns();
  const addOn = addOnsData.find(a => a.id === addOnId);
  
  if (!addOn) throw new Error('Add-on not found');
  
  // Check if add-on already exists
  if (assignment.selectedAddOns.some(a => a.id === addOnId)) {
    throw new Error('Add-on already added to this package');
  }

  const selectedAddOns = [...assignment.selectedAddOns, { ...addOn, selected: true }];
  const totalPrice = assignment.basePrice + selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const remainingBalance = totalPrice - assignment.totalPaid;

  // Recalculate payment milestones
  const paymentMilestones = assignment.paymentMilestones.map(m => {
    const percentage = m.percentage;
    const newAmount = (totalPrice * percentage) / 100;
    return {
      ...m,
      amount: m.status === 'paid' ? m.amount : newAmount
    };
  });

  await update(assignmentRef, {
    selectedAddOns,
    totalPrice,
    remainingBalance,
    paymentMilestones,
    updatedAt: new Date().toISOString()
  });
};

// Get add-ons
export const getAddOns = async (): Promise<PackageAddOn[]> => {
  const addOnsRef = ref(database, 'addOns');
  const snapshot = await get(addOnsRef);
  
  if (!snapshot.exists()) return [];
  
  const addOnsObj = snapshot.val();
  return Object.values(addOnsObj);
};

// Create/Update add-ons (admin)
export const saveAddOn = async (addOn: Omit<PackageAddOn, 'id'> | PackageAddOn): Promise<void> => {
  if ('id' in addOn && addOn.id) {
    // Update existing
    const addOnRef = ref(database, `addOns/${addOn.id}`);
    await set(addOnRef, addOn);
  } else {
    // Create new
    const addOnRef = push(ref(database, 'addOns'));
    const newAddOn = {
      ...addOn,
      id: addOnRef.key!
    };
    await set(addOnRef, newAddOn);
  }
};

// Delete add-on
export const deleteAddOn = async (addOnId: string): Promise<void> => {
  const addOnRef = ref(database, `addOns/${addOnId}`);
  await remove(addOnRef);
};

// Seed default add-ons
export const seedDefaultAddOns = async (): Promise<void> => {
  const defaultAddOns = [
    {
      name: 'Rush Delivery',
      description: 'Expedite project delivery by 50%',
      price: 200,
      category: 'Delivery'
    },
    {
      name: 'Extra Revisions (+5)',
      description: '5 additional revision rounds',
      price: 100,
      category: 'Revisions'
    },
    {
      name: 'Extended Maintenance',
      description: '6 additional months of support',
      price: 300,
      category: 'Support'
    },
    {
      name: 'Multi-language Support',
      description: 'Support for 2 additional languages',
      price: 400,
      category: 'Features'
    },
    {
      name: 'SEO Boost Package',
      description: 'Advanced SEO optimization for 3 months',
      price: 500,
      category: 'Marketing'
    },
    {
      name: 'Training Session',
      description: '2-hour training for your team',
      price: 150,
      category: 'Training'
    },
    {
      name: 'Professional Content Writing',
      description: 'SEO-optimized content for 10 pages',
      price: 250,
      category: 'Content'
    },
    {
      name: 'Professional Photography',
      description: '1-day product photography session',
      price: 600,
      category: 'Photography'
    }
  ];

  for (const addOn of defaultAddOns) {
    await saveAddOn(addOn);
  }
};
