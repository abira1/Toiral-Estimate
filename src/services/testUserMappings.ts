/**
 * Test User Access Code Mappings
 * This file manages the mapping between access codes and Firebase user IDs
 */

interface TestUserMapping {
  accessCode: string;
  userId: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

const STORAGE_KEY = 'toiral_test_user_mappings';

/**
 * Save test user mapping to localStorage
 */
export const saveTestUserMapping = (mapping: TestUserMapping) => {
  const mappings = getTestUserMappings();
  const existingIndex = mappings.findIndex(m => m.accessCode === mapping.accessCode);
  
  if (existingIndex >= 0) {
    mappings[existingIndex] = mapping;
  } else {
    mappings.push(mapping);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
};

/**
 * Get all test user mappings
 */
export const getTestUserMappings = (): TestUserMapping[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Get user ID by access code
 */
export const getUserIdByAccessCode = (accessCode: string): string | null => {
  const mappings = getTestUserMappings();
  const mapping = mappings.find(m => m.accessCode.toLowerCase() === accessCode.toLowerCase());
  return mapping ? mapping.userId : null;
};

/**
 * Get test user info by access code
 */
export const getTestUserInfo = (accessCode: string): TestUserMapping | null => {
  const mappings = getTestUserMappings();
  return mappings.find(m => m.accessCode.toLowerCase() === accessCode.toLowerCase()) || null;
};

/**
 * Clear all test user mappings
 */
export const clearTestUserMappings = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Check if access code is a known test user
 */
export const isTestUserAccessCode = (accessCode: string): boolean => {
  const knownCodes = ['admin', 'testuser1', 'testuser2', 'testuser3'];
  return knownCodes.includes(accessCode.toLowerCase());
};
