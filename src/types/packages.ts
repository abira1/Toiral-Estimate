// Package Assignment Types

export interface PackageAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  selected?: boolean;
}

export interface PaymentMilestone {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
  paidAmount?: number;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedDate?: string;
  weight: number; // percentage of project this milestone represents
}

export interface UserPackageAssignment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  packageId: string;
  packageCategory: string;
  packageName: string;
  packageDescription: string;
  basePrice: number;
  selectedAddOns: PackageAddOn[];
  totalPrice: number; // basePrice + addOns
  
  // Progress tracking
  progress: number; // 0-100
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  projectMilestones: ProjectMilestone[];
  
  // Payment tracking
  paymentMilestones: PaymentMilestone[];
  totalPaid: number;
  remainingBalance: number;
  nextPaymentDue?: string;
  nextPaymentAmount?: number;
  
  // Dates
  assignedDate: string;
  startDate?: string;
  expectedCompletionDate?: string;
  actualCompletionDate?: string;
  
  // Notes and customization
  notes?: string;
  customizations?: string[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string; // admin user ID
}

export interface PackageAssignmentRequest {
  userId: string;
  userName: string;
  userEmail: string;
  packages: {
    packageId: string;
    addOns?: string[]; // add-on IDs
  }[];
  paymentStructure: {
    installments: number;
    percentages: number[]; // e.g., [30, 40, 30] for 3 installments
  };
  startDate?: string;
  notes?: string;
}

export interface QuotationPDFData {
  quotationNumber: string;
  date: string;
  clientInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  packages: Array<{
    name: string;
    description: string;
    basePrice: number;
    addOns: PackageAddOn[];
    subtotal: number;
  }>;
  totalAmount: number;
  paymentTerms: {
    installments: PaymentMilestone[];
  };
  validUntil: string;
  terms?: string[];
}
