import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, UserStats } from '../types';

type AuthContextValue = {
  user: User | null;
  firebaseUser: any | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName: string, role: UserRole, interests: string[]) => Promise<void>;
  signInDemo: () => void;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and auto-login with demo user
    const timer = setTimeout(() => {
      console.log('🎭 Auto-signing in with demo mode');
      const demoUser: User = {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@mindfulscreen.app',
        role: 'student',
        interests: ['productivity', 'learning', 'wellness'],
        skills: ['focus', 'time-management'],
        joinedCommunities: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          totalFocusTime: 120,
          focusSessionsCount: 5,
          communitiesJoined: 2,
          skillsLearned: 3,
          gamesPlayed: 10,
          level: 2,
          xp: 250,
          streak: 3,
          lastActiveDate: new Date()
        }
      };
      
      setUser(demoUser);
      setFirebaseUser(null);
      setLoading(false);
      console.log('✅ Demo user logged in successfully');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in with:', email);
      setLoading(true);
      
      // Simulate Firebase auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: 'firebase-user-' + Date.now(),
        name: email.split('@')[0],
        email: email,
        role: 'student',
        interests: ['productivity'],
        skills: [],
        joinedCommunities: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          totalFocusTime: 0,
          focusSessionsCount: 0,
          communitiesJoined: 0,
          skillsLearned: 0,
          gamesPlayed: 0,
          level: 1,
          xp: 0,
          streak: 0,
          lastActiveDate: new Date()
        }
      };
      
      setUser(mockUser);
      setFirebaseUser({ uid: mockUser.id, email: mockUser.email });
      setLoading(false);
      console.log('✅ Sign in successful');
    } catch (error: any) {
      setLoading(false);
      console.error('❌ Sign in error:', error);
      throw new Error('Sign in failed. Please try again.');
    }
  };

  const registerWithEmail = async (
    email: string, 
    password: string, 
    displayName: string, 
    role: UserRole, 
    interests: string[]
  ) => {
    try {
      console.log('📝 Registering new user:', email);
      setLoading(true);
      
      // Simulate Firebase registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser: User = {
        id: 'new-user-' + Date.now(),
        name: displayName,
        email: email,
        role: role,
        interests: interests,
        skills: [],
        joinedCommunities: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          totalFocusTime: 0,
          focusSessionsCount: 0,
          communitiesJoined: 0,
          skillsLearned: 0,
          gamesPlayed: 0,
          level: 1,
          xp: 0,
          streak: 0,
          lastActiveDate: new Date()
        }
      };
      
      setUser(newUser);
      setFirebaseUser({ uid: newUser.id, email: newUser.email });
      setLoading(false);
      console.log('✅ Registration successful');
    } catch (error: any) {
      setLoading(false);
      console.error('❌ Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    }
  };

  const signInDemo = () => {
    console.log('🎭 Signing in with demo mode');
    const demoUser: User = {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@mindfulscreen.app',
      role: 'student',
      interests: ['productivity', 'learning', 'wellness'],
      skills: ['focus', 'time-management', 'mindfulness'],
      joinedCommunities: ['productivity-masters', 'mindfulness-group'],
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        totalFocusTime: 180,
        focusSessionsCount: 8,
        communitiesJoined: 2,
        skillsLearned: 3,
        gamesPlayed: 15,
        level: 3,
        xp: 420,
        streak: 5,
        lastActiveDate: new Date()
      }
    };
    
    setUser(demoUser);
    setFirebaseUser(null);
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      setUser(null);
      setFirebaseUser(null);
      console.log('✅ Signed out successfully');
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      throw new Error('Sign out failed');
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      console.log('📝 Updating user profile...');
      const updatedUser = { ...user, ...updates, updatedAt: new Date() };
      setUser(updatedUser);
      console.log('✅ User profile updated');
    } catch (error: any) {
      console.error('❌ Profile update error:', error);
      throw new Error('Profile update failed');
    }
  };

  const value: AuthContextValue = {
    user,
    firebaseUser,
    loading,
    signInWithEmail,
    registerWithEmail,
    signInDemo,
    signOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
