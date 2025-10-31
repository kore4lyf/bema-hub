"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useResetPasswordRequestMutation } from "@/lib/api/authApi";
import { toast } from "sonner";
import Link from "next/link";
import GuestOnlyRoute from "@/components/auth/GuestOnlyRoute";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <GuestOnlyRoute>
      <ResetPasswordContent />
    </GuestOnlyRoute>
  );
}

function ResetPasswordContent() {
  const [requestReset, { isLoading: isRequesting }] = useResetPasswordRequestMutation();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await requestReset({ email }).unwrap();
      
      // Store email for later use in the OTP verification page
      localStorage.setItem('resetPasswordEmail', email);
      
      toast.success("Password reset link sent to your email");
      setEmailSent(true);
    } catch (error: any) {
      // Handle rate limiting (HTTP 429) with precise time formatting
      if (error.status === 429 || error.data?.code === 'password_reset_request_limit_exceeded') {
        toast.error(error.data?.message || "Too many password reset requests. Please try again later.");
      } else {
        toast.error(error.data?.message || "Failed to send reset link");
      }
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Check Your Email</CardTitle>
              <CardDescription className="text-center">
                We've sent a password reset link to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Click the link in your email to reset your password. The link will expire in 10 minutes.
              </p>
              
              <Button 
                onClick={() => setEmailSent(false)} 
                variant="outline" 
                className="w-full"
              >
                Send Another Link
              </Button>
              
              <div className="text-center">
                <Link href="/signin" className="text-sm text-blue-600 hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isRequesting}>
                {isRequesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link href="/signin" className="text-sm text-blue-600 hover:underline">
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
