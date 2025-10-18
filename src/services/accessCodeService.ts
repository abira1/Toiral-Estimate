import { ref, set, get, push } from "firebase/database";
import { database } from "../config/firebase";

export interface AccessCode {
  id: string;
  code: string;
  email: string;
  userName: string;
  role: 'user' | 'admin';
  createdAt: string;
  createdBy: string; // admin user ID
  used: boolean;
  usedAt?: string;
  expiresAt: string; // 7 days from creation
}

// Generate a random access code
export const generateAccessCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a new access code
export const createAccessCode = async (
  email: string,
  userName: string,
  role: 'user' | 'admin' = 'user',
  createdBy: string
): Promise<AccessCode> => {
  const accessCodeRef = push(ref(database, 'access-codes'));
  const accessCodeId = accessCodeRef.key!;
  
  const code = generateAccessCode();
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7); // 7 days expiry
  
  const accessCode: AccessCode = {
    id: accessCodeId,
    code,
    email,
    userName,
    role,
    createdAt: new Date().toISOString(),
    createdBy,
    used: false,
    expiresAt: expirationDate.toISOString()
  };
  
  await set(accessCodeRef, accessCode);
  return accessCode;
};

// Get access code by code string
export const getAccessCodeByCode = async (code: string): Promise<AccessCode | null> => {
  const accessCodesRef = ref(database, 'access-codes');
  const snapshot = await get(accessCodesRef);
  
  if (!snapshot.exists()) return null;
  
  const accessCodesObj = snapshot.val();
  const accessCodes: AccessCode[] = Object.values(accessCodesObj);
  
  return accessCodes.find(ac => ac.code === code && !ac.used && new Date(ac.expiresAt) > new Date()) || null;
};

// Mark access code as used
export const markAccessCodeAsUsed = async (accessCodeId: string): Promise<void> => {
  const accessCodeRef = ref(database, `access-codes/${accessCodeId}`);
  await set(accessCodeRef, {
    used: true,
    usedAt: new Date().toISOString()
  });
};

// Get all access codes (admin only)
export const getAllAccessCodes = async (): Promise<AccessCode[]> => {
  const accessCodesRef = ref(database, 'access-codes');
  const snapshot = await get(accessCodesRef);
  
  if (!snapshot.exists()) return [];
  
  const accessCodesObj = snapshot.val();
  return Object.values(accessCodesObj);
};

// Clean up expired access codes
export const cleanupExpiredCodes = async (): Promise<void> => {
  const accessCodes = await getAllAccessCodes();
  const now = new Date();
  
  for (const accessCode of accessCodes) {
    if (new Date(accessCode.expiresAt) <= now) {
      const accessCodeRef = ref(database, `access-codes/${accessCode.id}`);
      await set(accessCodeRef, null); // Delete expired code
    }
  }
};