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
  limitToLast,
  startAt,
  endAt
} from "firebase/database";
import { database } from "../config/firebase";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  profilePicture?: string;
  createdAt: string;
  lastActive?: string;
}

export interface ServicePackage {
  id: string;
  category: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  deliveryTime?: number; // in days
  addOns?: PackageAddOn[];
}

export interface PackageAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryTime: number; // in days
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

export interface Quotation {
  id: string;
  name: string;
  userId: string;
  clientInfo: {
    name: string;
    email: string;
    phone: string;
  };
  servicePackage: ServicePackage;
  addOns: AddOn[];
  discount: number;
  totalPrice: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  quotationId?: string;
  status: 'active' | 'pending' | 'completed';
  progress: number;
  startDate: string;
  nextMilestone?: string;
  nextPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

// User operations
export const createUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
  const userRef = push(ref(database, 'users'));
  const userId = userRef.key!;
  const user: User = {
    ...userData,
    id: userId,
    createdAt: new Date().toISOString()
  };
  await set(userRef, user);
  return user;
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userRef = ref(database, `users/${userId}`);
  const snapshot = await get(userRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  const userRef = ref(database, `users/${userId}`);
  await update(userRef, updates);
};

export const getAllUsers = async (): Promise<User[]> => {
  const usersRef = ref(database, 'users');
  const snapshot = await get(usersRef);
  if (!snapshot.exists()) return [];
  
  const usersObj = snapshot.val();
  return Object.values(usersObj);
};

// Quotation operations
export const createQuotation = async (quotationData: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>) => {
  const quotationRef = push(ref(database, 'quotations'));
  const quotationId = quotationRef.key!;
  const quotation: Quotation = {
    ...quotationData,
    id: quotationId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await set(quotationRef, quotation);
  
  // Update analytics
  await updateAnalytics(quotation);
  
  return quotation;
};

export const getQuotation = async (quotationId: string): Promise<Quotation | null> => {
  const quotationRef = ref(database, `quotations/${quotationId}`);
  const snapshot = await get(quotationRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const updateQuotation = async (quotationId: string, updates: Partial<Quotation>) => {
  const quotationRef = ref(database, `quotations/${quotationId}`);
  await update(quotationRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

export const deleteQuotation = async (quotationId: string) => {
  const quotationRef = ref(database, `quotations/${quotationId}`);
  await remove(quotationRef);
};

export const getUserQuotations = async (userId: string): Promise<Quotation[]> => {
  const quotationsRef = ref(database, 'quotations');
  const snapshot = await get(quotationsRef);
  if (!snapshot.exists()) return [];
  
  const quotationsObj = snapshot.val();
  const quotations: Quotation[] = Object.values(quotationsObj);
  return quotations.filter(q => q.userId === userId);
};

export const getAllQuotations = async (): Promise<Quotation[]> => {
  const quotationsRef = ref(database, 'quotations');
  const snapshot = await get(quotationsRef);
  if (!snapshot.exists()) return [];
  
  const quotationsObj = snapshot.val();
  return Object.values(quotationsObj);
};

// Real-time listeners
export const listenToQuotations = (userId: string | null, callback: (quotations: Quotation[]) => void) => {
  const quotationsRef = ref(database, 'quotations');
  
  const unsubscribe = onValue(quotationsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    
    const quotationsObj = snapshot.val();
    const quotations: Quotation[] = Object.values(quotationsObj);
    
    if (userId) {
      callback(quotations.filter(q => q.userId === userId));
    } else {
      callback(quotations);
    }
  });
  
  return () => off(quotationsRef);
};

// Service operations
export const createService = async (serviceData: Omit<ServicePackage, 'id'>) => {
  const serviceRef = push(ref(database, 'services'));
  const serviceId = serviceRef.key!;
  const service: ServicePackage = {
    ...serviceData,
    id: serviceId
  };
  await set(serviceRef, service);
  return service;
};

export const getAllServices = async (): Promise<ServicePackage[]> => {
  const servicesRef = ref(database, 'services');
  const snapshot = await get(servicesRef);
  if (!snapshot.exists()) return [];
  
  const servicesObj = snapshot.val();
  return Object.values(servicesObj);
};

export const updateService = async (serviceId: string, updates: Partial<ServicePackage>) => {
  const serviceRef = ref(database, `services/${serviceId}`);
  await update(serviceRef, updates);
};

export const deleteService = async (serviceId: string) => {
  const serviceRef = ref(database, `services/${serviceId}`);
  await remove(serviceRef);
};

// Project operations
export const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
  const projectRef = push(ref(database, 'projects'));
  const projectId = projectRef.key!;
  const project: Project = {
    ...projectData,
    id: projectId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await set(projectRef, project);
  return project;
};

export const getUserProjects = async (userId: string): Promise<Project[]> => {
  const projectsRef = ref(database, 'projects');
  const snapshot = await get(projectsRef);
  if (!snapshot.exists()) return [];
  
  const projectsObj = snapshot.val();
  const projects: Project[] = Object.values(projectsObj);
  return projects.filter(p => p.userId === userId);
};

export const updateProject = async (projectId: string, updates: Partial<Project>) => {
  const projectRef = ref(database, `projects/${projectId}`);
  await update(projectRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

// Analytics operations
const updateAnalytics = async (quotation: Quotation) => {
  const today = new Date().toISOString().split('T')[0];
  const analyticsRef = ref(database, `analytics/${today}`);
  
  const snapshot = await get(analyticsRef);
  const currentData = snapshot.exists() ? snapshot.val() : {
    quotationsCreated: 0,
    revenue: 0,
    packageSelections: {}
  };
  
  const packageKey = `${quotation.servicePackage.category}-${quotation.servicePackage.name}`;
  
  await set(analyticsRef, {
    quotationsCreated: currentData.quotationsCreated + 1,
    revenue: currentData.revenue + quotation.totalPrice,
    packageSelections: {
      ...currentData.packageSelections,
      [packageKey]: (currentData.packageSelections[packageKey] || 0) + 1
    }
  });
};

export const getAnalytics = async (startDate: string, endDate: string) => {
  const analyticsRef = ref(database, 'analytics');
  const snapshot = await get(analyticsRef);
  
  if (!snapshot.exists()) return [];
  
  const analyticsObj = snapshot.val();
  return Object.entries(analyticsObj)
    .filter(([date]) => date >= startDate && date <= endDate)
    .map(([date, data]) => ({ date, ...data as any }));
};

// User presence
export const updateUserPresence = async (userId: string) => {
  const presenceRef = ref(database, `presence/${userId}`);
  await set(presenceRef, {
    online: true,
    lastActive: new Date().toISOString()
  });
};

export const listenToUserPresence = (callback: (users: Record<string, any>) => void) => {
  const presenceRef = ref(database, 'presence');
  
  const unsubscribe = onValue(presenceRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback({});
      return;
    }
    callback(snapshot.val());
  });
  
  return () => off(presenceRef);
};
