"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useSigninMutation } from "@/lib/api/authApi";
import { setCredentials } from "@/lib/features/auth/authSlice";
import { GoogleLoginButton, FacebookLoginButton, TwitterLoginButton } from "@/components/auth/SocialLogin";

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signIn, { isLoading }] = useSigninMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await signIn({
        username: formData.email,
        password: formData.password,
      }).unwrap();

      const user = {
        id: String(result.user_id || ''),
        email: result.user_email || formData.email,
        name: result.user_display_name || result.user_login || formData.email,
        username: result.user_login,
        avatar_url: result.avatar_url,
      };

      dispatch(setCredentials({
        authData: {
          ...result,
          timestamp: new Date().toISOString(),
        }
      }));

      toast.success("Signed in successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.data?.message || "Sign in failed");
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/reset-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <GoogleLoginButton />
        <FacebookLoginButton />
        <TwitterLoginButton />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
