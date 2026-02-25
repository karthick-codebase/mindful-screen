import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, UserRole, UserStats } from '../types';

type AuthContextValue = {
  user: User | null;
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
  const [loading, setLoading] = useState(true);

  // No Firebase - this function is no longer needed

  useEffect(() => {
    console.log('🎭 Skipping Firebase Auth - Starting in demo mode');
    
    // Simulate loading time then start demo mode
    const timer = setTimeout(() => {
      signInDemo();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulate sign in process for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a demo user based on email
      const demoUser: User = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0] || 'User',
        email: email,
        role: 'student',
        interests: ['productivity', 'learning'],
        skills: ['focus'],
        joinedCommunities: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          totalFocusTime: 45,
          focusSessionsCount: 3,
          communitiesJoined: 1,
          skillsLearned: 2,
          gamesPlayed: 5,
          level: 2,
          xp: 850,
          streak: 3,
          lastActiveDate: new Date()
        }
      };
      
      setUser(demoUser);
      console.log('✅ Demo sign in successful');
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      throw new Error(error.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
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
      setLoading(true);
      
      // Simulate registration process for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new demo user
      const newUser: User = {
        id: 'user-' + Date.now(),
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
      console.log('✅ Demo registration successful');
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
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
      skills: ['focus', 'time-management'],
      joinedCommunities: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        totalFocusTime: 120, // 2 hours
        focusSessionsCount: 5,
        communitiesJoined: 2,
        skillsLearned: 3,
        gamesPlayed: 10,
        level: 3,
        xp: 1250,
        streak: 7,
        lastActiveDate: new Date()
      }
    };
    
    setUser(demoUser);
    setLoading(false);
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Simulate sign out process
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      console.log('✅ Demo sign out successful');
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      throw new Error('Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user signed in');
    
    try {
      setLoading(true);
      
      // Simulate profile update process
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...updates, updatedAt: new Date() };
      setUser(updatedUser);
      
      console.log('✅ Demo profile updated successfully');
    } catch (error: any) {
      console.error('❌ Profile update error:', error);
      throw new Error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithEmail,
      registerWithEmail,
      signInDemo,
      signOut,
      updateUserProfile,
    }}>
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

export default AuthContext;
