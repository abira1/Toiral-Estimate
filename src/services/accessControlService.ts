/**
 * Access Control Service
 * Ensures users can only access their own data based on their access code
 */

import { getAllClients } from './workflowService';

/**
 * Get the current logged-in client's ID from localStorage
 */
export const getCurrentClientId = (): string | null => {
  return localStorage.getItem('clientId');
};

/**
 * Get the current logged-in client's access code from localStorage
 */
export const getCurrentAccessCode = (): string | null => {
  return localStorage.getItem('userAccessCode');
};

/**
 * Validate if the current user has access to a specific client ID
 * @param clientId - The client ID to check access for
 * @returns true if user has access, false otherwise
 */
export const validateClientAccess = (clientId: string): boolean => {
  const currentClientId = getCurrentClientId();
  
  // If no client ID is stored, user might be admin
  if (!currentClientId) {
    return false;
  }
  
  // User can only access their own client ID
  return currentClientId === clientId;
};

/**
 * Validate if the current access code matches the provided client
 * This is a stronger validation that checks against the database
 */
export const validateAccessCodeForClient = async (clientId: string): Promise<boolean> => {
  const currentAccessCode = getCurrentAccessCode();
  const currentClientId = getCurrentClientId();
  
  // Must have both access code and client ID
  if (!currentAccessCode || !currentClientId) {
    return false;
  }
  
  // Client IDs must match
  if (currentClientId !== clientId) {
    return false;
  }
  
  try {
    // Verify the access code matches the client in the database
    const clients = await getAllClients();
    const client = clients.find(c => c.id === clientId);
    
    if (!client || !client.accessCode) {
      return false;
    }
    
    // Access code must match
    return client.accessCode === currentAccessCode;
  } catch (error) {
    console.error('Error validating access code:', error);
    return false;
  }
};

/**
 * Check if current user is admin
 */
export const isAdmin = (): boolean => {
  return localStorage.getItem('isAdmin') === 'true';
};

/**
 * Require client access or throw error
 * Use this in components to enforce access control
 */
export const requireClientAccess = (clientId: string): void => {
  // Admins have access to all clients
  if (isAdmin()) {
    return;
  }
  
  // Regular users must match the client ID
  if (!validateClientAccess(clientId)) {
    throw new Error('ACCESS_DENIED: You do not have permission to access this client data');
  }
};

/**
 * Get the current user's accessible client ID
 * Returns null if user is admin (can access all)
 * Returns clientId if user is a regular client
 */
export const getAccessibleClientId = (): string | null => {
  if (isAdmin()) {
    return null; // Admin can access all
  }
  
  return getCurrentClientId();
};
