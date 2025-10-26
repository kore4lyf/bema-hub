"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { signUp, clearError } from "@/lib/features/auth/authSlice";
import { fetchCountries, fetchCities, setSelectedCountry, setSelectedCity } from "@/lib/features/location/locationSlice";

interface Country {
  name: { common: string };
  cca2: string;
}

interface City {
  id: number;
  name: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref") || "";
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [loadingCities, setLoadingCities] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    countryCode: "",
    city: "",
    referred_by: referredBy,
  });
  const [otp, setOtp] = useState("");

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    if (formData.country) {
      setFormData(prev => ({ ...prev, city: "" }));
      dispatch(fetchCities(formData.country));
    }
  }, [formData.country, dispatch]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countries.find(c => c.name.common === e.target.value);
    if (selectedCountry) {
      dispatch(setSelectedCountry({ 
        name: selectedCountry.name.common, 
        code: selectedCountry.cca2 
      }));
    }
    setFormData({
      ...formData,
      country: e.target.value,
      countryCode: selectedCountry?.cca2 || "",
      city: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const result = await dispatch(signUp({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        country: formData.country,
        state: formData.city,
        referred_by: formData.referred_by || referredBy,
      })).unwrap();

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err || "Sign up failed");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    // OTP verification would be handled here
    toast.success("Account verified successfully!");
    setStep("success");
  };

  const handleSocialSignup = async (provider: string) => {
    try {
      // Redirect to WordPress social signup endpoints
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (provider === 'google') {
        window.location.href = `${baseUrl}/wp-json/custom/v1/auth/google?redirect_uri=${window.location.origin}/dashboard`;
      } else if (provider === 'facebook') {
        window.location.href = `${baseUrl}/wp-json/custom/v1/auth/facebook?redirect_uri=${window.location.origin}/dashboard`;
      } else if (provider === 'twitter') {
        window.location.href = `${baseUrl}/wp-json/custom/v1/auth/twitter?redirect_uri=${window.location.origin}/dashboard`;
      }
    } catch (error) {
      toast.error("Social signup failed. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {step === "form" && "Create your account"}
          {step === "otp" && "Verify your email"}
          {step === "success" && "Account created!"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {step === "form" && "Start your journey with Bema Hub today"}
          {step === "otp" && `Enter the code sent to ${formData.email}`}
          {step === "success" && "Redirecting you to sign in..."}
        </p>
      </div>

      {error && (
        <Card className="p-4 border-destructive bg-destructive/10">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {step === "form" && (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>
            </div>

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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <div className="relative">
                  <select
                    id="country"
                    value={formData.country}
                    onChange={handleCountryChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.cca2} value={country.name.common} data-flag={country.cca2.toLowerCase()}>
                        {country.name.common}
                      </option>
                    ))}
                  </select>
                  {formData.countryCode && (
                    <img 
                      src={`https://flagcdn.com/w20/${formData.countryCode.toLowerCase()}.png`}
                      alt={`${formData.country} flag`}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">State</Label>
                <select
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={!formData.country || loadingCities}
                  required
                >
                  <option value="">
                    {loadingCities ? "Loading states..." : "Select state"}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referred_by">Referral Code (Optional)</Label>
              <Input
                id="referred_by"
                placeholder="Enter referral code"
                value={formData.referred_by}
                onChange={(e) => setFormData({ ...formData, referred_by: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
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
            <Button variant="outline" type="button" onClick={() => handleSocialSignup("google")}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button" onClick={() => handleSocialSignup("facebook")}>
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
            <Button variant="outline" type="button" onClick={() => handleSocialSignup("twitter")}>
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <Card className="p-6 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="text-sm text-muted-foreground mb-4">
              We've sent a 6-digit verification code to your email address.
            </p>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-widest"
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading || otp.length !== 6}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Create Account"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setStep("form")}
          >
            Back to form
          </Button>
        </form>
      )}

      {step === "success" && (
        <Card className="p-8 text-center">
          <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-xl font-semibold mb-2">Account Created Successfully!</h2>
          <p className="text-sm text-muted-foreground">
            You can now sign in with your credentials.
          </p>
        </Card>
      )}
    </div>
  );
}
