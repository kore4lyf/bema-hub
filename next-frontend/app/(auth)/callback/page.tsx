"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { socialLogin } from "@/lib/social-auth";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const provider = searchParams.get('provider');
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        toast.error("Social login failed. Please try again.");
        router.push('/signin');
        return;
      }

      if (provider && code) {
        try {
          // Handle the callback based on provider
          // This would typically exchange the code for user data
          // For now, redirect to signin if no direct social data
          router.push('/signin');
        } catch (error) {
          toast.error("Authentication failed. Please try again.");
          router.push('/signin');
        }
      } else {
        router.push('/signin');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-sm text-muted-foreground">Processing authentication...</p>
      </div>
    </div>
  );
}
