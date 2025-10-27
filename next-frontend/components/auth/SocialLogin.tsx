"use client";

import { useDispatch } from 'react-redux';
import { useSocialLoginMutation } from '@/lib/api/authApi';
import { setCredentials } from '@/lib/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function GoogleLoginButton() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [socialLogin, { isLoading }] = useSocialLoginMutation();

  const handleGoogleLogin = async (response: any) => {
    try {
      const profile = response.getBasicProfile();
      
      const socialData = {
        provider: 'google',
        provider_id: profile.getId(),
        email: profile.getEmail(),
        first_name: profile.getGivenName(),
        last_name: profile.getFamilyName()
      };

      const result = await socialLogin(socialData).unwrap();
      
      if (result.token) {
        dispatch(setCredentials({
          authData: {
            ...result,
            timestamp: new Date().toISOString(),
          }
        }));
        toast.success('Google login successful!');
        
        // Route based on email verification status
        if (result.bema_email_verified === false) {
          router.push('/signup/verify');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      toast.error(error.data?.message || 'Google login failed');
    }
  };

  return (
    <Button variant="outline" type="button" disabled={isLoading}>
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Google
    </Button>
  );
}

export function FacebookLoginButton() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [socialLogin, { isLoading }] = useSocialLoginMutation();

  const handleFacebookLogin = async () => {
    try {
      (window as any).FB.login(async (response: any) => {
        if (response.authResponse) {
          (window as any).FB.api('/me', { fields: 'id,name,email,first_name,last_name' }, async (profile: any) => {
            const socialData = {
              provider: 'facebook',
              provider_id: profile.id,
              email: profile.email,
              first_name: profile.first_name,
              last_name: profile.last_name
            };

            try {
              const result = await socialLogin(socialData).unwrap();
              
              if (result.token) {
                dispatch(setCredentials({
                  authData: {
                    ...result,
                    timestamp: new Date().toISOString(),
                  }
                }));
                toast.success('Facebook login successful!');
                
                // Route based on email verification status
                if (result.bema_email_verified === false) {
                  router.push('/signup/verify');
                } else {
                  router.push('/dashboard');
                }
              }
            } catch (error: any) {
              toast.error(error.data?.message || 'Facebook login failed');
            }
          });
        }
      }, { scope: 'public_profile,email' });
    } catch (error: any) {
      toast.error('Facebook login failed');
    }
  };

  return (
    <Button variant="outline" type="button" onClick={handleFacebookLogin} disabled={isLoading}>
      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      Facebook
    </Button>
  );
}

export function TwitterLoginButton() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [socialLogin, { isLoading }] = useSocialLoginMutation();

  const handleTwitterLogin = async (twitterUserData: any) => {
    try {
      const socialData = {
        provider: 'twitter',
        provider_id: twitterUserData.id,
        email: twitterUserData.email,
        first_name: twitterUserData.first_name,
        last_name: twitterUserData.last_name
      };

      const result = await socialLogin(socialData).unwrap();
      
      if (result.token) {
        dispatch(setCredentials({
          authData: {
            ...result,
            timestamp: new Date().toISOString(),
          }
        }));
        toast.success('Twitter login successful!');
        
        // Route based on email verification status
        if (result.bema_email_verified === false) {
          router.push('/signup/verify');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      toast.error(error.data?.message || 'Twitter login failed');
    }
  };

  return (
    <Button variant="outline" type="button" disabled={isLoading}>
      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      X
    </Button>
  );
}
