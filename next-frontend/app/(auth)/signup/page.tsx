"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, CheckCircle2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useSignupMutation, useVerifyOtpMutation, useResendOtpMutation } from "@/lib/api/authApi";
import { setPendingUserEmail, setCredentials } from "@/lib/features/auth/authSlice";
import { useGetCountriesQuery, useGetStatesMutation } from "@/lib/api/locationApi";
import { GoogleLoginButton, FacebookLoginButton, TwitterLoginButton } from "@/components/auth/SocialLogin";
import { RootState } from "@/lib/store";

interface Country {
  name: string;
  iso2: string;
  flag: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');
  
  const [registerUser, { isLoading: isRegistering }] = useSignupMutation();
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [getStates, { data: states = [], isLoading: statesLoading }] = useGetStatesMutation();

  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [lastFetchedCountry, setLastFetchedCountry] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    country: "",
    countryCode: "",
    state: "",
    referredBy: referralCode || "",
  });

  // Only fetch countries once - RTK Query will cache this
  const { data: countries = [], isLoading: countriesLoading } = useGetCountriesQuery();
  const { pendingUserEmail } = useSelector((state: RootState) => state.auth);

  // Memoized filtered countries for performance
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries; // Show all countries when no search
    return countries.filter(country => 
      country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countries, countrySearch]);

  useEffect(() => {
    if (pendingUserEmail) {
      setStep('verify');
    }
  }, [pendingUserEmail]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (!pendingUserEmail || resendTimer > 0) return;
    
    try {
      await resendOtp({ email: pendingUserEmail }).unwrap();
      toast.success("New verification code sent to your email");
      setResendTimer(60); // 60 second cooldown
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to resend code");
    }
  };

  // Memoized state fetcher to prevent unnecessary calls
  const fetchStatesForCountry = useCallback((country: string) => {
    if (country && country !== lastFetchedCountry) {
      getStates(country);
      setLastFetchedCountry(country);
    }
  }, [getStates, lastFetchedCountry]);

  // Only fetch states when country changes and is different from last fetched
  useEffect(() => {
    fetchStatesForCountry(formData.country);
  }, [formData.country, fetchStatesForCountry]);

  // Calculate password strength
  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength += 1;
      if (/[A-Z]/.test(formData.password)) strength += 1;
      if (/[0-9]/.test(formData.password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.country) {
      newErrors.country = "Country is required";
    }
    
    if (!formData.state) {
      newErrors.state = "State is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const result = await registerUser({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        country: formData.country,
        state: formData.state,
        referred_by: formData.referredBy,
      }).unwrap();

      dispatch(setPendingUserEmail(formData.email));
      toast.success("Registration successful! Please check your email for OTP.");
      setStep('verify');
    } catch (err: any) {
      toast.error(err.data?.message || "Registration failed");
    }
  };

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

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otpCode.join('');
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    try {
      const result = await verifyOTP({
        email: pendingUserEmail!,
        otp_code: otpString
      }).unwrap();

      // Set credentials if verification was successful
      if (result.token) {
        dispatch(setCredentials({
          user: {
            id: result.user_id || '',
            email: result.user_email || pendingUserEmail,
            name: result.user_display_name || `${formData.firstName} ${formData.lastName}`,
          },
          token: result.token
        }));
        
        toast.success("Email verified successfully!");
        router.push("/dashboard");
      } else {
        toast.success("Email verified successfully! Please sign in.");
        router.push("/signin");
      }
    } catch (err: any) {
      toast.error(err.data?.message || "OTP verification failed");
    }
  };

  const handleResendOTP = async () => {
    try {
      // Assuming there's an endpoint for resending OTP
      // This would need to be implemented in the API
      toast.info("Resend functionality coming soon");
    } catch (err: any) {
      toast.error("Failed to resend OTP");
    }
  };

  if (step === 'verify') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We've sent a verification code to <strong>{pendingUserEmail}</strong>
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
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl p-0"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              {errors.otp && <p className="text-sm text-destructive">{errors.otp}</p>}
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
            variant="link" 
            className="text-primary hover:underline p-0 h-auto"
            onClick={handleResendOtp}
            disabled={isResending || resendTimer > 0}
          >
            {isResending ? (
              <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Sending...</>
            ) : resendTimer > 0 ? (
              `Resend in ${resendTimer}s`
            ) : (
              "Resend code"
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Join our community and start your journey
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={`w-full justify-between ${errors.country ? "border-destructive" : ""}`}
                    disabled={countriesLoading}
                  >
                    {formData.country || (countriesLoading ? 'Loading...' : 'Select Country')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search countries..." 
                      value={countrySearch}
                      onValueChange={setCountrySearch}
                    />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {filteredCountries.map((country) => (
                        <CommandItem
                          key={country.iso2}
                          value={country.name}
                          onSelect={(value) => {
                            const selectedCountry = countries.find((c) => c.name === value);
                            handleInputChange("country", value);
                            handleInputChange("countryCode", selectedCountry?.iso2 || "");
                            handleInputChange("state", "");
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <img 
                              src={country.flag}
                              alt=""
                              className="w-4 h-3 object-cover rounded-sm"
                              loading="lazy"
                            />
                            {country.name}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select
                value={formData.state}
                onValueChange={(value) => handleInputChange("state", value)}
                disabled={!formData.country || statesLoading}
              >
                <SelectTrigger className={errors.state ? "border-destructive" : ""}>
                  <SelectValue placeholder={statesLoading ? "Loading states..." : "Select state"} />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state: any) => (
                    <SelectItem key={state.state_code} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={errors.password ? "border-destructive pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {formData.password && (
              <div className="space-y-1">
                <div className="flex h-1.5 gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 rounded-full ${
                        level <= passwordStrength
                          ? passwordStrength < 3
                            ? "bg-red-500"
                            : passwordStrength < 4
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {passwordStrength < 2
                    ? "Weak password"
                    : passwordStrength < 4
                    ? "Medium password"
                    : "Strong password"}
                </p>
              </div>
            )}
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
          </div>

          {referralCode && (
            <div className="space-y-2">
              <Label htmlFor="referredBy">Referral Code</Label>
              <Input
                id="referredBy"
                type="text"
                placeholder="Enter referral code (optional)"
                value={formData.referredBy}
                onChange={(e) => handleInputChange("referredBy", e.target.value)}
                disabled
              />
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isRegistering}>
            {isRegistering ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
          </Button>
        </form>
      </CardContent>

      <div className="relative px-6">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-3">
          <GoogleLoginButton />
          <FacebookLoginButton />
          <TwitterLoginButton />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col">
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}