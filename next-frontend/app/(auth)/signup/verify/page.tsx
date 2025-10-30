"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Loader2, Mail, CheckCircle, XCircle, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/lib/api/authApi";
import { setCredentials } from "@/lib/features/auth/authSlice";
import { RootState } from "@/lib/store";

export default function VerifyOTPPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [hasResentOnLoad, setHasResentOnLoad] = useState(false);
  
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Get user data from Redux state (persisted automatically)
    const email = authState.user?.email;
    
    if (!email) {
      toast.error("No signup data found. Please sign up first.");
      router.push('/signup');
    } else {
      setUserEmail(email);
    }
  }, [authState.user, router]);

  // Resend OTP on page load
  useEffect(() => {
    if (userEmail && !hasResentOnLoad) {
      handleResendOtpOnLoad();
      setHasResentOnLoad(true);
    }
  }, [userEmail, hasResentOnLoad]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleResendOtpOnLoad = async () => {
    try {
      await resendOtp({ email: userEmail }).unwrap();
      toast.success("Verification code sent to your email");
      setResendTimer(60); // 60 second cooldown
    } catch (err: any) {
      // Handle rate limiting gracefully on page load
      if (err.status === 429 || err.data?.code === 'otp_request_limit_exceeded') {
        console.log("Rate limit reached on page load:", err.data?.message);
        // Don't show error toast on page load for rate limiting
      } else {
        console.log("Failed to resend code on page load:", err);
      }
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otpCode.join('');
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    if (!userEmail) {
      toast.error("Email not found. Please sign up again.");
      router.push('/signup');
      return;
    }

    try {
      const result = await verifyOTP({
        email: userEmail,
        otp_code: otpString
      }).unwrap();

      // For verification success, redirect to dashboard
      // The actual token will be provided during sign in
      if (result.success) {
        toast.success(result.message || "Email verified successfully!");
        router.push("/dashboard");
      } else {
        toast.success("Email verified successfully! Please sign in.");
        router.push("/signin");
      }
    } catch (err: any) {
      toast.error(err.data?.message || "OTP verification failed");
    }
  };

  const handleResendOtp = async () => {
    if (!userEmail || resendTimer > 0) return;
    
    try {
      await resendOtp({ email: userEmail }).unwrap();
      toast.success("New verification code sent to your email");
      setResendTimer(60); // 60 second cooldown
    } catch (err: any) {
      // Handle rate limiting (HTTP 429) with precise time formatting
      if (err.status === 429 || err.data?.code === 'otp_request_limit_exceeded') {
        toast.error(err.data?.message || "Too many requests. Please try again later.");
      } else {
        toast.error(err.data?.message || "Failed to resend code");
      }
    }
  };

  if (!userEmail) {
    return (
      <div className="grid place-content-center px-4 py-12 overflow-y-scroll">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid place-content-center px-4 py-12 overflow-y-scroll">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            We've sent a verification code to <strong>{userEmail}</strong>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="flex justify-center gap-3">
                {otpCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl p-0"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isVerifying || otpCode.some(d => !d)}>
              {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Email"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <p className="text-center text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleResendOtp}
            disabled={isResending || resendTimer > 0}
          >
            {isResending ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending...</>
            ) : resendTimer > 0 ? (
              <><RefreshCw className="h-4 w-4 mr-2" /> Resend in {resendTimer}s</>
            ) : (
              <><RefreshCw className="h-4 w-4 mr-2" /> Resend code</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}