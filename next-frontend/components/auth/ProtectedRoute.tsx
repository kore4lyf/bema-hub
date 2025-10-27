"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  fallback,
  redirectTo = '/signin' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, user, router, redirectTo]);

  if (!isAuthenticated && !user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

// Higher-order component version
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: { redirectTo?: string }
) => {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute redirectTo={options?.redirectTo}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};
