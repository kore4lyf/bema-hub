"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { useRequestPasswordResetMutation, useVerifyResetOTPMutation, useSetNewPasswordMutation } from "@/lib/api/authApi";
import { setResetUserEmail, clearResetUserEmail } from "@/lib/features/auth/authSlice";
import { RootState } from "@/lib/store";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { resetUserEmail } = useSelector((state: RootState) => state.auth);
  
  const [requestReset, { isLoading: isRequesting }] = useRequestPasswordResetMutation();
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyResetOTPMutation();
  const [setNewPassword, { isLoading: isSetting }] = useSetNewPasswordMutation();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await requestReset({ email }).unwrap();
      dispatch(setResetUserEmail(email));
      toast.success("Reset code sent to your email");
      setStep(2);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send reset code");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await verifyOTP({ 
        email: resetUserEmail!, 
        otpCode: otp,
        purpose: 'password_reset'
      }).unwrap();
      
      toast.success("OTP verified successfully");
      setStep(3);
    } catch (error: any) {
      toast.error(error.data?.message || "Invalid OTP");
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      await setNewPassword({ 
        email: resetUserEmail!,
        otpCode: otp,
        newPassword: password 
      }).unwrap();
      
      dispatch(clearResetUserEmail());
      
      toast.success("Password reset successfully! Please sign in.");
      router.push("/signin");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {step === 1 && "Reset Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Set New Password"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
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
                  {isRequesting ? "Sending..." : "Send Reset Code"}
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  Enter the verification code sent to {resetUserEmail}
                </p>
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isVerifying}>
                  {isVerifying ? "Verifying..." : "Verify Code"}
                </Button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSetNewPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSetting}>
                  {isSetting ? "Setting..." : "Set New Password"}
                </Button>
              </form>
            )}

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
