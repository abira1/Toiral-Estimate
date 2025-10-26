import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInAnonymously
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUser, getUser, updateUser, User, getAllUsers } from '../services/firebaseService';
import { getTestUserInfo, isTestUserAccessCode } from '../services/testUserMappings';
import { getAccessCodeByCode, markAccessCodeAsUsed } from '../services/accessCodeService';
import { getAllClients } from '../services/workflowService';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithAccessCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Load user profile from database
        const profile = await getUser(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in database
    await createUser({
      name,
      email,
      role: 'user'
    });
  };

  const logout = async () => {
    // Clear all client-related data from localStorage
    localStorage.removeItem('clientId');
    localStorage.removeItem('clientCode');
    localStorage.removeItem('userAccessCode');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
    
    await signOut(auth);
  };

  const loginWithAccessCode = async (code: string) => {
    console.log('🔐 loginWithAccessCode called with:', code);
    
    // Validate access code format
    if (!code || code.trim().length === 0) {
      throw new Error('ACCESS_CODE_EMPTY: Please enter an access code');
    }
    
    if (code.trim().length < 3) {
      throw new Error('ACCESS_CODE_TOO_SHORT: Access code must be at least 3 characters');
    }
    
    console.log('🔥 Starting Firebase anonymous auth...');
    // Use anonymous auth
    const userCredential = await signInAnonymously(auth);
    const firebaseUserId = userCredential.user.uid;
    console.log('✅ Firebase anonymous auth successful:', firebaseUserId);
    
    // First, try to validate against Firebase access codes (existing system)
    try {
      const accessCodeData = await getAccessCodeByCode(code);
      
      if (accessCodeData) {
        // Mark access code as used
        await markAccessCodeAsUsed(accessCodeData.id);
        
        // Create user profile based on access code information
        const profile = await createUser({
          name: accessCodeData.userName,
          email: accessCodeData.email,
          role: accessCodeData.role
        });
        
        setUserProfile(profile);
        return;
      }
    } catch (error) {
      console.log('Could not validate access code against Firebase, checking other systems');
    }

    // Second, check if this is a client access code OR client code from the new workflow system
    try {
      console.log('🔍 Searching for client with code:', code);
      // Try to find client by access code OR client code
      const clientsWithCodes = await getAllClients();
      console.log('📋 Total clients found:', clientsWithCodes.length);
      
      // Log all clients for debugging
      clientsWithCodes.forEach(client => {
        console.log(`Client: ${client.name}, AccessCode: ${client.accessCode}, ClientCode: ${client.clientCode}`);
      });
      
      const clientWithCode = clientsWithCodes.find(client => 
        (client.accessCode && client.accessCode.toLowerCase() === code.toLowerCase()) || 
        (client.clientCode && client.clientCode.toLowerCase() === code.toLowerCase())
      );
      
      if (clientWithCode) {
        console.log('✅ Found matching client:', clientWithCode.name, 'ID:', clientWithCode.id);
        
        // Create a user profile for this client
        const clientProfile: User = {
          id: firebaseUserId,
          name: clientWithCode.name,
          email: clientWithCode.email,
          role: 'user',
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          phone: clientWithCode.phone
        };
        
        // Store client ID and access code for access control validation
        localStorage.setItem('clientId', clientWithCode.id);
        localStorage.setItem('clientCode', clientWithCode.clientCode);
        localStorage.setItem('userAccessCode', clientWithCode.accessCode || code);
        
        console.log('💾 Stored in localStorage:', {
          clientId: clientWithCode.id,
          clientCode: clientWithCode.clientCode,
          accessCode: clientWithCode.accessCode
        });
        
        setUserProfile(clientProfile);
        return;
      } else {
        console.log('❌ No client found with code:', code);
      }
    } catch (error) {
      console.log('Could not validate client access code, checking test user codes', error);
    }
    
    // Check if this is a known test user access code with pre-created data
    const knownTestCodes = ['admin', 'testuser1', 'testuser2', 'testuser3'];
    const isKnownTestCode = knownTestCodes.includes(code.toLowerCase());
    
    console.log('🧪 Checking test user code:', code, 'isKnownTestCode:', isKnownTestCode);
    
    // Check if this is a known test user access code with pre-created data
    if (isTestUserAccessCode(code)) {
      console.log('✅ Found test user access code');
      const testUserInfo = getTestUserInfo(code);
      console.log('📋 Test user info:', testUserInfo);
      
      if (testUserInfo) {
        // Try to get the pre-created user profile by searching for it
        try {
          console.log('🔍 Searching for existing user profile...');
          const allUsers = await getAllUsers();
          const profile = allUsers.find(u => 
            u.email === testUserInfo.email || 
            u.name === testUserInfo.name
          );
          
          if (profile) {
            console.log('✅ Found existing profile:', profile.name);
            setUserProfile(profile);
            // Update last active time
            await updateUser(profile.id, { lastActive: new Date().toISOString() });
            return;
          }
        } catch (error) {
          console.log('Could not fetch existing users, will create new profile:', error);
        }
      }
    }
    
    // If no pre-existing profile found, try to create a new one
    console.log('🔧 Creating new profile for Firebase user:', firebaseUserId);
    try {
      // Check if user profile exists for this Firebase user
      let profile = await getUser(firebaseUserId);
      console.log('👤 Existing profile check result:', profile ? 'found' : 'not found');
      
      if (!profile) {
        // Create new user profile
        const role = code.toLowerCase() === 'admin' ? 'admin' : 'user';
        const name = code.toLowerCase() === 'admin' ? 'Admin User' : 'Guest User';
        console.log('🆕 Creating new user profile:', { name, role });
        profile = await createUser({
          name,
          email: `${firebaseUserId}@toiral.local`,
          role
        });
        console.log('✅ Created new profile:', profile.name);
      }
      
      console.log('📝 Setting user profile:', profile.name);
      setUserProfile(profile);
      console.log('✅ Login successful for:', profile.name);
    } catch (error: any) {
      // If Firebase permissions don't allow creating users, create a temporary profile
      console.warn('Could not create user in database, using temporary profile:', error);
      const role = code.toLowerCase() === 'admin' ? 'admin' : 'user';
      const tempProfile: User = {
        id: firebaseUserId,
        name: code.toLowerCase() === 'admin' ? 'Admin User' : 'Guest User',
        email: `${firebaseUserId}@toiral.local`,
        role,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      console.log('🔄 Using temporary profile:', tempProfile.name);
      setUserProfile(tempProfile);
      console.log('✅ Login successful with temp profile for:', tempProfile.name);
    }
    
    // If we reached here and it's not a known test code, it's invalid
    if (!isKnownTestCode) {
      console.log('❌ Invalid access code:', code);
      throw new Error('INVALID_ACCESS_CODE: Invalid access code. Please check your code and try again.');
    }
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    signup,
    logout,
    loginWithAccessCode
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
