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
    await signOut(auth);
  };

  const loginWithAccessCode = async (code: string) => {
    // Use anonymous auth
    const userCredential = await signInAnonymously(auth);
    const firebaseUserId = userCredential.user.uid;
    
    // Check if this is a known test user access code with pre-created data
    if (isTestUserAccessCode(code)) {
      const testUserInfo = getTestUserInfo(code);
      
      if (testUserInfo) {
        // Try to get the pre-created user profile by searching for it
        try {
          const allUsers = await getAllUsers();
          const profile = allUsers.find(u => 
            u.email === testUserInfo.email || 
            u.name === testUserInfo.name
          );
          
          if (profile) {
            setUserProfile(profile);
            // Update last active time
            await updateUser(profile.id, { lastActive: new Date().toISOString() });
            return;
          }
        } catch (error) {
          console.log('Could not fetch existing users, will create new profile');
        }
      }
    }
    
    // If no pre-existing profile found, try to create a new one
    try {
      // Check if user profile exists for this Firebase user
      let profile = await getUser(firebaseUserId);
      
      if (!profile) {
        // Create new user profile
        const role = code.toLowerCase() === 'admin' ? 'admin' : 'user';
        const name = code.toLowerCase() === 'admin' ? 'Admin User' : 'Guest User';
        profile = await createUser({
          name,
          email: `${firebaseUserId}@toiral.local`,
          role
        });
      }
      
      setUserProfile(profile);
    } catch (error: any) {
      // If Firebase permissions don't allow creating users, create a temporary profile
      console.warn('Could not create user in database, using temporary profile');
      const role = code.toLowerCase() === 'admin' ? 'admin' : 'user';
      const tempProfile: User = {
        id: firebaseUserId,
        name: code.toLowerCase() === 'admin' ? 'Admin User' : 'Guest User',
        email: `${firebaseUserId}@toiral.local`,
        role,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      setUserProfile(tempProfile);
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
