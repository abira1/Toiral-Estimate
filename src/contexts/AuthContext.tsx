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
    // For demo purposes, use anonymous auth with stored access code
    const userCredential = await signInAnonymously(auth);
    const userId = userCredential.user.uid;
    
    // Check if user profile exists
    let profile = await getUser(userId);
    
    if (!profile) {
      // Create new user profile
      const role = code.toLowerCase() === 'admin' ? 'admin' : 'user';
      profile = await createUser({
        name: code.toLowerCase() === 'admin' ? 'Admin User' : 'Guest User',
        email: `${userId}@toiral.local`,
        role
      });
    }
    
    setUserProfile(profile);
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
