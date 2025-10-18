// Enhanced Data Structure for Client Quotation Management Workflow
// Supporting advanced project management with milestones and payment tracking

export interface Client {
  id: string;
  clientCode: string; // Unique 8-character code (e.g., "CLI001AB")
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  selectedPackage?: string; // Package type selected during creation
  additionalNotes?: string;
  projectDetails?: string;
  accessCode?: string; // Generated access code for login
  createdAt: string;
  createdBy: string; // Admin user ID
  status: 'active' | 'inactive' | 'pending';
}

export interface ProjectSetup {
  id: string;
  clientId: string;
  clientCode: string;
  projectName: string;
  features: string[];
  description: string;
  basePrice: number;
  baseDeadline: number; // in days
  availableCoupons: Coupon[];
  addOns: ProjectAddOn[];
  status: 'draft' | 'setup_complete' | 'sent_to_client' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  extraDeliveryTime: number; // in days
  category?: string;
  isRequired?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number; // percentage or fixed amount
  discountType: 'percentage' | 'fixed';
  description: string;
  validUntil?: string;
  minOrderAmount?: number;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
}

export interface ClientQuotation {
  id: string;
  clientId: string;
  clientCode: string;
  projectId: string;
  
  // Selected items
  selectedAddOns: ProjectAddOn[];
  appliedCoupon?: Coupon;
  
  // Calculated pricing
  basePrice: number;
  addOnsTotal: number;
  discountAmount: number;
  finalPrice: number;
  
  // Calculated delivery
  baseDeliveryTime: number;
  addOnsDeliveryTime: number;
  finalDeliveryTime: number;
  
  // Client confirmation
  clientConfirmed: boolean;
  confirmedAt?: string;
  
  status: 'pending_approval' | 'confirmed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface RunningProject {
  id: string;
  clientId: string;
  clientCode: string;
  quotationId: string;
  projectName: string;
  description: string;
  
  // Timeline
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  
  // Progress tracking
  overallProgress: number; // 0-100%
  milestones: ProjectMilestone[];
  
  // Payment tracking
  paymentStatus: 'pending' | 'partially_confirmed' | 'fully_confirmed';
  paymentBreakdown: PaymentStage[];
  
  // Project details
  features: string[];
  selectedAddOns: ProjectAddOn[];
  finalPrice: number;
  finalDeliveryTime: number;
  
  status: 'active' | 'on_hold' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  progress: number; // 0-100%
  notes?: string;
  order: number; // For sequencing milestones
}

export interface PaymentStage {
  id: string;
  projectId: string;
  title: string;
  amount: number;
  percentage: number; // of total project cost
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  order: number; // For sequencing payments
}

export interface InvitationDetails {
  clientId: string;
  clientCode: string;
  clientName: string;
  clientEmail: string;
  projectId: string;
  projectName: string;
  accessCode: string;
  invitationSentAt: string;
  invitationAcceptedAt?: string;
}

// Workflow status tracking
export interface WorkflowStatus {
  clientId: string;
  currentStep: 'client_created' | 'project_setup' | 'invitation_sent' | 'client_approval' | 'project_running' | 'project_completed';
  steps: {
    clientCreated: { completed: boolean; completedAt?: string; };
    projectSetup: { completed: boolean; completedAt?: string; };
    invitationSent: { completed: boolean; completedAt?: string; };
    clientApproval: { completed: boolean; completedAt?: string; };
    projectRunning: { completed: boolean; completedAt?: string; };
    projectCompleted: { completed: boolean; completedAt?: string; };
  };
  updatedAt: string;
}

// Analytics interfaces for the new workflow
export interface WorkflowAnalytics {
  totalClients: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  pendingApprovals: number;
  
  // Payment analytics
  pendingPayments: number;
  partiallyPaidProjects: number;
  fullyPaidProjects: number;
  
  // Timeline analytics
  averageProjectDuration: number;
  onTimeDeliveryRate: number;
  
  // Conversion analytics
  invitationAcceptanceRate: number;
  quotationApprovalRate: number;
}

// Client dashboard interfaces
export interface ClientDashboardData {
  client: Client;
  pendingApprovals: ClientQuotation[];
  activeProjects: RunningProject[];
  completedProjects: RunningProject[];
  quotationHistory: ClientQuotation[];
}

// Admin dashboard interfaces
export interface AdminDashboardData {
  totalClients: number;
  totalProjects: number;
  totalRevenue: number;
  recentClients: Client[];
  recentProjects: RunningProject[];
  pendingApprovals: ClientQuotation[];
  upcomingMilestones: ProjectMilestone[];
  pendingPayments: PaymentStage[];
}