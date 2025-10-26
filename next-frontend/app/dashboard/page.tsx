"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, LogOut, User, Mail, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
import { TokenManager } from "@/lib/token-manager";
import { getProfile, apiRequest, ApiError } from "@/lib/api";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country?: string;
  city?: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!TokenManager.isAuthenticated()) {
      router.push('/signin');
      return;
    }

    loadProfile();
  }, [router]);

  const loadProfile = async () => {
    try {
      const profileData = await getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load profile:', error);
      if (error instanceof ApiError && error.status === 401) {
        TokenManager.clearToken();
        router.push('/signin');
      } else {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await apiRequest('/auth/signout', { method: 'POST' });
    } catch (error) {
      console.error('Signout error:', error);
    } finally {
      TokenManager.clearToken();
      toast.success('Signed out successfully');
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <p className="text-destructive">Failed to load profile</p>
          <Button onClick={loadProfile} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const initials = `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bema Hub</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-bold">
              Welcome, {profile.first_name}!
            </h2>
            <p className="text-muted-foreground mt-2">
              Manage your Bema Hub account and explore opportunities
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>{profile.first_name} {profile.last_name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
                {profile.country && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span>{profile.city}, {profile.country}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start">
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View Campaigns
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Browse Events
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Settings
                </Button>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity to display</p>
              <p className="text-sm mt-2">Start exploring to see your activity here</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
