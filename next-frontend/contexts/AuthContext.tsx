"use client";

import { createContext, useContext, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { hydrateAuth } from '@/lib/features/auth/authSlice';

interface AuthContextType {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<any>;
  signUp: (userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  socialLogin: (providerData: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const auth = useAuth();

  // Hydrate auth state on mount
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  const value = {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isSigningIn || auth.isSigningUp || auth.isSocialLogin,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    socialLogin: auth.socialLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
