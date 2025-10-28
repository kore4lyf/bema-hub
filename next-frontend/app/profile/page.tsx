"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Mail, MapPin, Phone, Calendar, Shield, Award, CheckCircle, XCircle, Globe, Hash, Clock } from "lucide-react";
import { toast } from "sonner";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/lib/api/authApi";
import { useGetCountriesQuery, useGetStatesMutation } from "@/lib/api/locationApi";
import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  display_name: string;
  bema_phone_number: string;
  bema_country: string;
  bema_state: string;
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { signOut, isAuthenticated } = useAuth();
  const auth = useSelector((state: RootState) => state.auth);
  
  const { data: profile, isLoading: isProfileLoading, isError, error } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated
  });
  
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const { data: countries = [], isLoading: isCountriesLoading } = useGetCountriesQuery();
  const [getStates, { data: states = [], isLoading: isStatesLoading }] = useGetStatesMutation();

  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    display_name: "",
    bema_phone_number: "",
    bema_country: "",
    bema_state: "",
  });

  const [lastFetchedCountry, setLastFetchedCountry] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch states when country changes
  useEffect(() => {
    if (formData.bema_country && formData.bema_country !== lastFetchedCountry) {
      getStates(formData.bema_country);
      setLastFetchedCountry(formData.bema_country);
    }
  }, [formData.bema_country, getStates, lastFetchedCountry]);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        display_name: profile.display_name,
        bema_phone_number: profile.bema_phone_number,
        bema_country: profile.bema_country,
        bema_state: profile.bema_state,
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        display_name: formData.display_name,
        bema_phone_number: formData.bema_phone_number,
        bema_country: formData.bema_country,
        bema_state: formData.bema_state,
      }).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update profile");
    }
  };

  // Show profile loading state
  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    // Check if this is an authentication error (401/403)
    const isAuthError = error && 
      ('status' in error) && 
      (error.status === 401 || error.status === 403);
    
    if (isAuthError) {
      // Token might be invalid, sign out and redirect to signin
      signOut();
      return null;
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center max-w-md">
          <div className="flex justify-center mb-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Failed to load profile</h2>
          <p className="text-muted-foreground mb-4">
            {"You must be signed in to view this page"}
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push('/signin')}>
              Sign In
            </Button>
            <Button variant="outline" onClick={() => router.refresh()}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <p className="text-destructive">No profile data available</p>
          <Button onClick={() => router.push('/signin')} className="mt-4">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  const initials = `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
  const emailVerified = profile.bema_email_verified;
  const phoneVerified = profile.bema_phone_verified;
  const isFraud = profile.bema_fraud_flag;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{profile.display_name}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email Verified</span>
                  {emailVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Phone Verified</span>
                  {phoneVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
                {isFraud && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Fraud Status</span>
                    <Badge variant="destructive">Flagged</Badge>
                  </div>
                )}
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{profile.bema_tier_level}</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm capitalize">{profile.role}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={formData.display_name}
                      onChange={(e) => handleInputChange("display_name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.bema_phone_number}
                      onChange={(e) => handleInputChange("bema_phone_number", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.bema_country}
                        onValueChange={(value) => handleInputChange("bema_country", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country: any) => (
                            <SelectItem key={country.iso2} value={country.name}>
                              <div className="flex items-center">
                                <img 
                                  src={country.flag} 
                                  alt={country.name} 
                                  className="w-4 h-3 mr-2 object-cover rounded-sm"
                                />
                                {country.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={formData.bema_state}
                        onValueChange={(value) => handleInputChange("bema_state", value)}
                        disabled={!formData.bema_country || isStatesLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isStatesLoading ? "Loading..." : "Select state"} />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state: any) => (
                            <SelectItem key={state.state_code} value={state.name}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">First Name</Label>
                      <p className="font-medium">{profile.first_name}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Last Name</Label>
                      <p className="font-medium">{profile.last_name}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Display Name</Label>
                    <p className="font-medium">{profile.display_name}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="font-medium">{profile.email}</p>
                      <Badge variant={emailVerified ? "default" : "destructive"} className="ml-2">
                        {emailVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Phone Number</Label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="font-medium">{profile.bema_phone_number || "Not provided"}</p>
                      {profile.bema_phone_number && (
                        <Badge variant={phoneVerified ? "default" : "destructive"} className="ml-2">
                          {phoneVerified ? "Verified" : "Unverified"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Country</Label>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="font-medium">{profile.bema_country || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">State</Label>
                      <p className="font-medium">{profile.bema_state || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Tier Level</Label>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="font-medium">{profile.bema_tier_level}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Account Type</Label>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="font-medium capitalize">{profile.bema_account_type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Member Since</Label>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="font-medium">
                          {profile.bema_last_signin ? new Date(profile.bema_last_signin * 1000).toLocaleDateString() : "Not available"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Last Sign Out</Label>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="font-medium">
                          {profile.bema_last_signout ? new Date(profile.bema_last_signout * 1000).toLocaleDateString() : "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Referral Code</Label>
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="font-medium font-mono">{profile.bema_referred_by || "Not available"}</p>
                    </div>
                  </div>

                  {(profile.bema_google_id || profile.bema_facebook_id || profile.bema_twitter_id) && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Social Accounts</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.bema_google_id && (
                            <Badge variant="secondary">Google Connected</Badge>
                          )}
                          {profile.bema_facebook_id && (
                            <Badge variant="secondary">Facebook Connected</Badge>
                          )}
                          {profile.bema_twitter_id && (
                            <Badge variant="secondary">Twitter Connected</Badge>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}