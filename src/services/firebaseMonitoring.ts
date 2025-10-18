import { ref, get, onValue, off } from 'firebase/database';
import { database } from '../config/firebase';

export interface FirebaseUsageStats {
  users: number;
  quotations: number;
  accessCodes: number;
  services: number;
  totalDataSize: number; // in MB
  activeConnections: number;
  lastUpdated: string;
}

export interface UsageAlert {
  type: 'warning' | 'error' | 'info';
  message: string;
  details?: string;
  timestamp: string;
}

// Get Firebase usage statistics
export const getFirebaseUsageStats = async (): Promise<FirebaseUsageStats> => {
  try {
    const rootRef = ref(database, '/');
    const snapshot = await get(rootRef);
    
    if (!snapshot.exists()) {
      return {
        users: 0,
        quotations: 0,
        accessCodes: 0,
        services: 0,
        totalDataSize: 0,
        activeConnections: 0,
        lastUpdated: new Date().toISOString()
      };
    }
    
    const data = snapshot.val();
    const dataString = JSON.stringify(data);
    const dataSizeBytes = new Blob([dataString]).size;
    const dataSizeMB = dataSizeBytes / (1024 * 1024);
    
    return {
      users: data.users ? Object.keys(data.users).length : 0,
      quotations: data.quotations ? Object.keys(data.quotations).length : 0,
      accessCodes: data['access-codes'] ? Object.keys(data['access-codes']).length : 0,
      services: data.services ? Object.keys(data.services).length : 0,
      totalDataSize: Number(dataSizeMB.toFixed(2)),
      activeConnections: data.presence ? Object.keys(data.presence).length : 0,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting Firebase usage stats:', error);
    throw error;
  }
};

// Check for potential Firebase issues
export const checkFirebaseHealth = async (): Promise<UsageAlert[]> => {
  const alerts: UsageAlert[] = [];
  
  try {
    const stats = await getFirebaseUsageStats();
    
    // Check data size (Firebase free tier has 1GB limit)
    if (stats.totalDataSize > 800) { // 800MB warning threshold
      alerts.push({
        type: 'error',
        message: 'Database size approaching limit',
        details: `Current size: ${stats.totalDataSize}MB. Firebase free tier limit is 1GB.`,
        timestamp: new Date().toISOString()
      });
    } else if (stats.totalDataSize > 500) { // 500MB warning threshold
      alerts.push({
        type: 'warning',
        message: 'Database size growing large',
        details: `Current size: ${stats.totalDataSize}MB. Consider cleaning up old data.`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check number of users (arbitrary business logic)
    if (stats.users > 1000) {
      alerts.push({
        type: 'warning',
        message: 'High user count',
        details: `${stats.users} users. Consider upgrading to paid plan for better performance.`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check number of quotations (performance consideration)
    if (stats.quotations > 10000) {
      alerts.push({
        type: 'warning',
        message: 'Large number of quotations',
        details: `${stats.quotations} quotations. Consider implementing data archiving.`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check for expired access codes (housekeeping)
    if (stats.accessCodes > 50) {
      alerts.push({
        type: 'info',
        message: 'Many access codes present',
        details: `${stats.accessCodes} access codes. Consider running cleanup for expired codes.`,
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    alerts.push({
      type: 'error',
      message: 'Unable to check Firebase health',
      details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    });
  }
  
  return alerts;
};

// Monitor Firebase real-time (for admin dashboard)
export const monitorFirebaseRealtime = (
  callback: (stats: FirebaseUsageStats) => void
): (() => void) => {
  const rootRef = ref(database, '/');
  
  const unsubscribe = onValue(rootRef, async (snapshot) => {
    try {
      const stats = await getFirebaseUsageStats();
      callback(stats);
    } catch (error) {
      console.error('Error in real-time monitoring:', error);
    }
  });
  
  return () => off(rootRef, 'value', unsubscribe);
};

// Get Firebase connection status
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    const testRef = ref(database, '.info/connected');
    const snapshot = await get(testRef);
    return snapshot.val() === true;
  } catch (error) {
    return false;
  }
};

// Cleanup expired access codes (utility function)
export const cleanupExpiredAccessCodes = async (): Promise<number> => {
  try {
    const { getAllAccessCodes } = await import('./accessCodeService');
    const accessCodes = await getAllAccessCodes();
    const now = new Date();
    
    let cleanedCount = 0;
    for (const accessCode of accessCodes) {
      if (new Date(accessCode.expiresAt) <= now) {
        // Delete expired code logic would go here
        cleanedCount++;
      }
    }
    
    return cleanedCount;
  } catch (error) {
    console.error('Error cleaning up access codes:', error);
    return 0;
  }
};