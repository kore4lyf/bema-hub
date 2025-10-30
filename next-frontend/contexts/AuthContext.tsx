"use client";

import { createContext, useContext, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
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
  const reduxAuth = useSelector((state: any) => state.auth);

  // Hydrate auth state on mount
  useEffect(() => {
    dispatch(hydrateAuth({ user: null, token: null, isAuthenticated: false, authData: null }));
  }, [dispatch]);

  const value = {
    user: reduxAuth.user,
    token: reduxAuth.token,
    isAuthenticated: reduxAuth.isAuthenticated,
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
