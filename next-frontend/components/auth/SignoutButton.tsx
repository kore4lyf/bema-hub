"use client";

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useSignoutMutation } from '@/lib/api/authApi';
import { signOut, logout } from '@/lib/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SignoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function SignoutButton({ variant = "outline", size = "default", className }: SignoutButtonProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [signout, { isLoading }] = useSignoutMutation();

  const handleSignout = async () => {
    try {
      await signout().unwrap();
      dispatch(signOut());
      toast.success('Signed out successfully');
      router.push('/signin');
    } catch (err: any) {
      console.error('Signout failed:', err);
      // Even if API call fails, clear token locally
      dispatch(logout());
      toast.info('Signed out locally');
      router.push('/signin');
    }
  };

  return (
    <Button 
      onClick={handleSignout} 
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </Button>
  );
}
