// Enhanced Firebase Service for Client Quotation Management Workflow
// Supporting advanced project management with milestones and payment tracking

import { 
  ref, 
  set, 
  get, 
  update, 
  remove, 
  push, 
  onValue,
  off,
  query,
  orderByChild,
  limitToLast
} from "firebase/database";
import { database } from "../config/firebase";
import {
  Client,
  ProjectSetup,
  ProjectAddOn,
  Coupon,
  ClientQuotation,
  RunningProject,
  ProjectMilestone,
  PaymentStage,
  InvitationDetails,
  WorkflowStatus,
  WorkflowAnalytics,
  ClientDashboardData,
  AdminDashboardData
} from "../types/workflow";

// Utility function to generate unique client codes
export const generateClientCode = (): string => {
  const prefix = "CLI";
  const numbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const letters = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `${prefix}${numbers}${letters}`;
};

// Utility function to generate access codes (enhanced from existing system)
export const generateAccessCode = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// ========================
// CLIENT MANAGEMENT
// ========================

export const createClient = async (clientData: Omit<Client, 'id' | 'clientCode' | 'createdAt' | 'status'>): Promise<Client> => {
  const clientRef = push(ref(database, 'workflow/clients'));
  const clientId = clientRef.key!;
  
  const client: Client = {
    ...clientData,
    id: clientId,
    clientCode: generateClientCode(),
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  
  await set(clientRef, client);
  
  // Initialize workflow status
  await createWorkflowStatus(client.id, 'client_created');
  
  return client;
};

export const getClient = async (clientId: string): Promise<Client | null> => {
  const clientRef = ref(database, `workflow/clients/${clientId}`);
  const snapshot = await get(clientRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const getClientByCode = async (clientCode: string): Promise<Client | null> => {
  const clientsRef = ref(database, 'workflow/clients');
  const snapshot = await get(clientsRef);
  
  if (!snapshot.exists()) return null;
  
  const clients = Object.values(snapshot.val()) as Client[];
  return clients.find(client => client.clientCode === clientCode) || null;
};

export const getAllClients = async (): Promise<Client[]> => {
  const clientsRef = ref(database, 'workflow/clients');
  const snapshot = await get(clientsRef);
  
  if (!snapshot.exists()) return [];
  
  return Object.values(snapshot.val());
};

export const updateClient = async (clientId: string, updates: Partial<Client>): Promise<void> => {
  const clientRef = ref(database, `workflow/clients/${clientId}`);
  await update(clientRef, updates);
};

// ========================
// PROJECT SETUP MANAGEMENT
// ========================

export const createProjectSetup = async (projectData: Omit<ProjectSetup, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<ProjectSetup> => {
  const projectRef = push(ref(database, 'workflow/project-setups'));
  const projectId = projectRef.key!;
  
  const project: ProjectSetup = {
    ...projectData,
    id: projectId,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  await set(projectRef, project);
  
  // Update workflow status
  await updateWorkflowStatus(projectData.clientId, 'project_setup');
  
  return project;
};

export const getProjectSetup = async (projectId: string): Promise<ProjectSetup | null> => {
  const projectRef = ref(database, `workflow/project-setups/${projectId}`);
  const snapshot = await get(projectRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const getProjectSetupByClient = async (clientId: string): Promise<ProjectSetup | null> => {
  const projectsRef = ref(database, 'workflow/project-setups');
  const snapshot = await get(projectsRef);
  
  if (!snapshot.exists()) return null;
  
  const projects = Object.values(snapshot.val()) as ProjectSetup[];
  return projects.find(project => project.clientId === clientId) || null;
};

export const updateProjectSetup = async (projectId: string, updates: Partial<ProjectSetup>): Promise<void> => {
  const projectRef = ref(database, `workflow/project-setups/${projectId}`);
  await update(projectRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

// ========================
// COUPON MANAGEMENT
// ========================

export const createCoupon = async (couponData: Omit<Coupon, 'id' | 'usedCount'>): Promise<Coupon> => {
  const couponRef = push(ref(database, 'workflow/coupons'));
  const couponId = couponRef.key!;
  
  const coupon: Coupon = {
    ...couponData,
    id: couponId,
    usedCount: 0
  };
  
  await set(couponRef, coupon);
  return coupon;
};

export const getCouponByCode = async (code: string): Promise<Coupon | null> => {
  const couponsRef = ref(database, 'workflow/coupons');
  const snapshot = await get(couponsRef);
  
  if (!snapshot.exists()) return null;
  
  const coupons = Object.values(snapshot.val()) as Coupon[];
  return coupons.find(coupon => coupon.code === code && coupon.isActive) || null;
};

export const getAllCoupons = async (): Promise<Coupon[]> => {
  const couponsRef = ref(database, 'workflow/coupons');
  const snapshot = await get(couponsRef);
  
  if (!snapshot.exists()) return [];
  
  return Object.values(snapshot.val());
};

// ========================
// CLIENT QUOTATION MANAGEMENT
// ========================

export const createClientQuotation = async (quotationData: Omit<ClientQuotation, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientQuotation> => {
  const quotationRef = push(ref(database, 'workflow/quotations'));
  const quotationId = quotationRef.key!;
  
  const quotation: ClientQuotation = {
    ...quotationData,
    id: quotationId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  await set(quotationRef, quotation);
  return quotation;
};

export const getClientQuotation = async (quotationId: string): Promise<ClientQuotation | null> => {
  const quotationRef = ref(database, `workflow/quotations/${quotationId}`);
  const snapshot = await get(quotationRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const getClientQuotations = async (clientId: string): Promise<ClientQuotation[]> => {
  const quotationsRef = ref(database, 'workflow/quotations');
  const snapshot = await get(quotationsRef);
  
  if (!snapshot.exists()) return [];
  
  const quotations = Object.values(snapshot.val()) as ClientQuotation[];
  return quotations.filter(q => q.clientId === clientId);
};

export const confirmClientQuotation = async (quotationId: string): Promise<void> => {
  const quotationRef = ref(database, `workflow/quotations/${quotationId}`);
  await update(quotationRef, {
    clientConfirmed: true,
    confirmedAt: new Date().toISOString(),
    status: 'confirmed',
    updatedAt: new Date().toISOString()
  });
  
  // Get quotation to update workflow
  const quotation = await getClientQuotation(quotationId);
  if (quotation) {
    await updateWorkflowStatus(quotation.clientId, 'client_approval');
    // Create running project
    await createRunningProjectFromQuotation(quotation);
  }
};

// ========================
// RUNNING PROJECT MANAGEMENT
// ========================

export const createRunningProject = async (projectData: Omit<RunningProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<RunningProject> => {
  const projectRef = push(ref(database, 'workflow/running-projects'));
  const projectId = projectRef.key!;
  
  const project: RunningProject = {
    ...projectData,
    id: projectId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  await set(projectRef, project);
  
  // Create default milestones and payment stages
  await createDefaultMilestones(projectId, project.finalDeliveryTime);
  await createDefaultPaymentStages(projectId, project.finalPrice);
  
  return project;
};

const createRunningProjectFromQuotation = async (quotation: ClientQuotation): Promise<void> => {
  const projectSetup = await getProjectSetupByClient(quotation.clientId);
  if (!projectSetup) return;
  
  const startDate = new Date();
  const estimatedEndDate = new Date();
  estimatedEndDate.setDate(startDate.getDate() + quotation.finalDeliveryTime);
  
  const runningProject: Omit<RunningProject, 'id' | 'createdAt' | 'updatedAt'> = {
    clientId: quotation.clientId,
    clientCode: quotation.clientCode,
    quotationId: quotation.id,
    projectName: projectSetup.projectName,
    description: projectSetup.description,
    startDate: startDate.toISOString(),
    estimatedEndDate: estimatedEndDate.toISOString(),
    overallProgress: 0,
    milestones: [],
    paymentStatus: 'pending',
    paymentBreakdown: [],
    features: projectSetup.features,
    selectedAddOns: quotation.selectedAddOns,
    finalPrice: quotation.finalPrice,
    finalDeliveryTime: quotation.finalDeliveryTime,
    status: 'active'
  };
  
  await createRunningProject(runningProject);
  await updateWorkflowStatus(quotation.clientId, 'project_running');
};

export const getRunningProject = async (projectId: string): Promise<RunningProject | null> => {
  const projectRef = ref(database, `workflow/running-projects/${projectId}`);
  const snapshot = await get(projectRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const getClientProjects = async (clientId: string): Promise<RunningProject[]> => {
  const projectsRef = ref(database, 'workflow/running-projects');
  const snapshot = await get(projectsRef);
  
  if (!snapshot.exists()) return [];
  
  const projects = Object.values(snapshot.val()) as RunningProject[];
  return projects.filter(p => p.clientId === clientId);
};

export const updateRunningProject = async (projectId: string, updates: Partial<RunningProject>): Promise<void> => {
  const projectRef = ref(database, `workflow/running-projects/${projectId}`);
  await update(projectRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

// ========================
// MILESTONE MANAGEMENT
// ========================

export const createDefaultMilestones = async (projectId: string, totalDays: number): Promise<void> => {
  const milestones = [
    { title: "Project Kickoff", percentage: 10, order: 1 },
    { title: "Design Phase", percentage: 30, order: 2 },
    { title: "Development Phase", percentage: 60, order: 3 },
    { title: "Testing Phase", percentage: 85, order: 4 },
    { title: "Project Delivery", percentage: 100, order: 5 }
  ];
  
  for (const milestone of milestones) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + Math.floor((totalDays * milestone.percentage) / 100));
    
    await createMilestone({
      projectId,
      title: milestone.title,
      description: `${milestone.title} completion`,
      targetDate: targetDate.toISOString(),
      status: 'pending',
      progress: 0,
      order: milestone.order
    });
  }
};

export const createMilestone = async (milestoneData: Omit<ProjectMilestone, 'id'>): Promise<ProjectMilestone> => {
  const milestoneRef = push(ref(database, 'workflow/milestones'));
  const milestoneId = milestoneRef.key!;
  
  const milestone: ProjectMilestone = {
    ...milestoneData,
    id: milestoneId
  };
  
  await set(milestoneRef, milestone);
  return milestone;
};

export const getProjectMilestones = async (projectId: string): Promise<ProjectMilestone[]> => {
  const milestonesRef = ref(database, 'workflow/milestones');
  const snapshot = await get(milestonesRef);
  
  if (!snapshot.exists()) return [];
  
  const milestones = Object.values(snapshot.val()) as ProjectMilestone[];
  return milestones.filter(m => m.projectId === projectId).sort((a, b) => a.order - b.order);
};

export const updateMilestone = async (milestoneId: string, updates: Partial<ProjectMilestone>): Promise<void> => {
  const milestoneRef = ref(database, `workflow/milestones/${milestoneId}`);
  await update(milestoneRef, updates);
};

// ========================
// PAYMENT STAGE MANAGEMENT
// ========================

export const createDefaultPaymentStages = async (projectId: string, totalAmount: number): Promise<void> => {
  const stages = [
    { title: "First Payment (60%)", percentage: 60, order: 1 },
    { title: "Second Payment (20%)", percentage: 20, order: 2 },
    { title: "Final Payment (20%)", percentage: 20, order: 3 }
  ];
  
  for (const stage of stages) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (stage.order * 15)); // Staggered payments every 15 days
    
    await createPaymentStage({
      projectId,
      title: stage.title,
      amount: Math.round((totalAmount * stage.percentage) / 100),
      percentage: stage.percentage,
      dueDate: dueDate.toISOString(),
      status: 'pending',
      order: stage.order
    });
  }
};

export const createPaymentStage = async (paymentData: Omit<PaymentStage, 'id'>): Promise<PaymentStage> => {
  const paymentRef = push(ref(database, 'workflow/payment-stages'));
  const paymentId = paymentRef.key!;
  
  const payment: PaymentStage = {
    ...paymentData,
    id: paymentId
  };
  
  await set(paymentRef, payment);
  return payment;
};

export const getProjectPaymentStages = async (projectId: string): Promise<PaymentStage[]> => {
  const paymentsRef = ref(database, 'workflow/payment-stages');
  const snapshot = await get(paymentsRef);
  
  if (!snapshot.exists()) return [];
  
  const payments = Object.values(snapshot.val()) as PaymentStage[];
  return payments.filter(p => p.projectId === projectId).sort((a, b) => a.order - b.order);
};

export const updatePaymentStage = async (paymentId: string, updates: Partial<PaymentStage>): Promise<void> => {
  const paymentRef = ref(database, `workflow/payment-stages/${paymentId}`);
  await update(paymentRef, updates);
};

export const confirmPayment = async (paymentId: string, paymentDetails: { paymentMethod: string; transactionId: string; notes?: string }): Promise<void> => {
  await updatePaymentStage(paymentId, {
    ...paymentDetails,
    status: 'paid',
    paidDate: new Date().toISOString()
  });
  
  // Update project payment status
  const payment = await getPaymentStage(paymentId);
  if (payment) {
    const allPayments = await getProjectPaymentStages(payment.projectId);
    const paidPayments = allPayments.filter(p => p.status === 'paid');
    
    let paymentStatus: 'pending' | 'partially_confirmed' | 'fully_confirmed' = 'pending';
    if (paidPayments.length === allPayments.length) {
      paymentStatus = 'fully_confirmed';
    } else if (paidPayments.length > 0) {
      paymentStatus = 'partially_confirmed';
    }
    
    await updateRunningProject(payment.projectId, { paymentStatus });
  }
};

const getPaymentStage = async (paymentId: string): Promise<PaymentStage | null> => {
  const paymentRef = ref(database, `workflow/payment-stages/${paymentId}`);
  const snapshot = await get(paymentRef);
  return snapshot.exists() ? snapshot.val() : null;
};

// ========================
// WORKFLOW STATUS TRACKING
// ========================

export const createWorkflowStatus = async (clientId: string, currentStep: WorkflowStatus['currentStep']): Promise<void> => {
  const statusRef = ref(database, `workflow/status/${clientId}`);
  
  const status: WorkflowStatus = {
    clientId,
    currentStep,
    steps: {
      clientCreated: { completed: currentStep === 'client_created', completedAt: currentStep === 'client_created' ? new Date().toISOString() : undefined },
      projectSetup: { completed: false },
      invitationSent: { completed: false },
      clientApproval: { completed: false },
      projectRunning: { completed: false },
      projectCompleted: { completed: false }
    },
    updatedAt: new Date().toISOString()
  };
  
  await set(statusRef, status);
};

export const updateWorkflowStatus = async (clientId: string, completedStep: WorkflowStatus['currentStep']): Promise<void> => {
  const statusRef = ref(database, `workflow/status/${clientId}`);
  const snapshot = await get(statusRef);
  
  if (!snapshot.exists()) return;
  
  const currentStatus = snapshot.val() as WorkflowStatus;
  const stepKey = completedStep.replace(/_([a-z])/g, (match, letter) => letter.charAt(0).toUpperCase() + letter.slice(1)) as keyof WorkflowStatus['steps'];
  
  const updatedSteps = {
    ...currentStatus.steps,
    [stepKey]: { completed: true, completedAt: new Date().toISOString() }
  };
  
  await update(statusRef, {
    currentStep: completedStep,
    steps: updatedSteps,
    updatedAt: new Date().toISOString()
  });
};

// ========================
// INVITATION MANAGEMENT
// ========================

export const sendClientInvitation = async (clientId: string, projectId: string): Promise<string> => {
  const client = await getClient(clientId);
  const project = await getProjectSetup(projectId);
  
  if (!client || !project) {
    throw new Error('Client or project not found');
  }
  
  // Generate access code if not exists
  if (!client.accessCode) {
    const accessCode = generateAccessCode();
    await updateClient(clientId, { accessCode });
    client.accessCode = accessCode;
  }
  
  // Create invitation record
  const invitationRef = push(ref(database, 'workflow/invitations'));
  const invitation: InvitationDetails = {
    clientId: client.id,
    clientCode: client.clientCode,
    clientName: client.name,
    clientEmail: client.email,
    projectId: project.id,
    projectName: project.projectName,
    accessCode: client.accessCode,
    invitationSentAt: new Date().toISOString()
  };
  
  await set(invitationRef, invitation);
  
  // Update project status
  await updateProjectSetup(projectId, { status: 'sent_to_client' });
  
  // Update workflow status
  await updateWorkflowStatus(clientId, 'invitation_sent');
  
  return client.accessCode;
};

// ========================
// DASHBOARD DATA
// ========================

export const getClientDashboardData = async (clientId: string): Promise<ClientDashboardData> => {
  const [client, quotations, projects] = await Promise.all([
    getClient(clientId),
    getClientQuotations(clientId),
    getClientProjects(clientId)
  ]);
  
  if (!client) {
    throw new Error('Client not found');
  }
  
  return {
    client,
    pendingApprovals: quotations.filter(q => q.status === 'pending_approval'),
    activeProjects: projects.filter(p => p.status === 'active'),
    completedProjects: projects.filter(p => p.status === 'completed'),
    quotationHistory: quotations
  };
};

export const getAdminDashboardData = async (): Promise<AdminDashboardData> => {
  const [clients, projects, quotations] = await Promise.all([
    getAllClients(),
    getAllRunningProjects(),
    getAllQuotations()
  ]);
  
  const totalRevenue = projects
    .filter(p => p.paymentStatus === 'fully_confirmed')
    .reduce((sum, p) => sum + p.finalPrice, 0);
  
  return {
    totalClients: clients.length,
    totalProjects: projects.length,
    totalRevenue,
    recentClients: clients.slice(-5),
    recentProjects: projects.slice(-5),
    pendingApprovals: quotations.filter(q => q.status === 'pending_approval'),
    upcomingMilestones: [],
    pendingPayments: []
  };
};

const getAllRunningProjects = async (): Promise<RunningProject[]> => {
  const projectsRef = ref(database, 'workflow/running-projects');
  const snapshot = await get(projectsRef);
  
  if (!snapshot.exists()) return [];
  
  return Object.values(snapshot.val());
};

const getAllQuotations = async (): Promise<ClientQuotation[]> => {
  const quotationsRef = ref(database, 'workflow/quotations');
  const snapshot = await get(quotationsRef);
  
  if (!snapshot.exists()) return [];
  
  return Object.values(snapshot.val());
};