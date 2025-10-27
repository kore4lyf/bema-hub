import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { 
  useSignInMutation, 
  useRegisterUserMutation, 
  useVerifyOTPMutation,
  useSocialLoginMutation,
  useSignoutMutation,
  useRequestPasswordResetMutation,
  useVerifyResetOTPMutation,
  useSetNewPasswordMutation
} from '@/lib/api/authApi';
import { 
  setCredentials, 
  signOut, 
  logout,
  setPendingUserEmail,
  setResetUserEmail,
  setResetToken,
  clearResetUserEmail,
  clearResetToken
} from '@/lib/features/auth/authSlice';
import { RootState } from '@/lib/store';
import { toast } from 'sonner';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  // RTK Query hooks
  const [signInMutation, signInState] = useSignInMutation();
  const [registerMutation, registerState] = useRegisterUserMutation();
  const [verifyOTPMutation, verifyOTPState] = useVerifyOTPMutation();
  const [socialLoginMutation, socialLoginState] = useSocialLoginMutation();
  const [signoutMutation, signoutState] = useSignoutMutation();
  const [requestResetMutation, requestResetState] = useRequestPasswordResetMutation();
  const [verifyResetMutation, verifyResetState] = useVerifyResetOTPMutation();
  const [setPasswordMutation, setPasswordState] = useSetNewPasswordMutation();

  // Unified auth methods
  const signIn = async (credentials: { email: string; password: string }) => {
    try {
      const result = await signInMutation(credentials).unwrap();
      dispatch(setCredentials({
        user: {
          id: result.user_id || '',
          email: result.user_email || credentials.email,
          name: result.user_display_name || result.user_nicename || credentials.email,
        },
        token: result.token
      }));
      toast.success('Signed in successfully!');
      router.push('/dashboard');
      return result;
    } catch (error: any) {
      toast.error(error.data?.message || 'Sign in failed');
      throw error;
    }
  };

  const signUp = async (userData: any) => {
    try {
      const result = await registerMutation(userData).unwrap();
      dispatch(setPendingUserEmail(userData.email));
      toast.success('Registration successful! Please check your email for OTP.');
      return result;
    } catch (error: any) {
      toast.error(error.data?.message || 'Registration failed');
      throw error;
    }
  };

  const verifyOTP = async (data: { email: string; otpCode: string }) => {
    try {
      const result = await verifyOTPMutation(data).unwrap();
      dispatch(setCredentials({
        user: {
          id: result.user_id || '',
          email: result.user_email || data.email,
          name: result.user_display_name || result.user_nicename || '',
        },
        token: result.token
      }));
      toast.success('Email verified successfully!');
      router.push('/dashboard');
      return result;
    } catch (error: any) {
      toast.error(error.data?.message || 'OTP verification failed');
      throw error;
    }
  };

  const socialLogin = async (providerData: any) => {
    try {
      const result = await socialLoginMutation(providerData).unwrap();
      dispatch(setCredentials({
        user: {
          id: result.user_id || '',
          email: result.user_email || providerData.email,
          name: result.user_display_name || `${providerData.first_name} ${providerData.last_name}`,
        },
        token: result.token
      }));
      toast.success('Social login successful!');
      router.push('/dashboard');
      return result;
    } catch (error: any) {
      toast.error(error.data?.message || 'Social login failed');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signoutMutation().unwrap();
      dispatch(signOut());
      toast.success('Signed out successfully');
      router.push('/signin');
    } catch (error: any) {
      dispatch(logout());
      toast.info('Signed out locally');
      router.push('/signin');
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await requestResetMutation({ email }).unwrap();
      dispatch(setResetUserEmail(email));
      toast.success('Reset code sent to your email');
      return true;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to send reset code');
      throw error;
    }
  };

  const verifyResetOTP = async (data: { email: string; otpCode: string }) => {
    try {
      const result = await verifyResetMutation(data).unwrap();
      if (result.reset_token) {
        dispatch(setResetToken(result.reset_token));
        toast.success('OTP verified successfully');
        return result;
      }
    } catch (error: any) {
      toast.error(error.data?.message || 'Invalid OTP');
      throw error;
    }
  };

  const setNewPassword = async (data: { token: string; newPassword: string }) => {
    try {
      await setPasswordMutation(data).unwrap();
      dispatch(clearResetToken());
      dispatch(clearResetUserEmail());
      toast.success('Password reset successfully');
      router.push('/signin');
      return true;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to reset password');
      throw error;
    }
  };

  return {
    // State
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    pendingUserEmail: auth.pendingUserEmail,
    resetUserEmail: auth.resetUserEmail,
    resetToken: auth.resetToken,

    // Loading states
    isSigningIn: signInState.isLoading,
    isSigningUp: registerState.isLoading,
    isVerifyingOTP: verifyOTPState.isLoading,
    isSocialLogin: socialLoginState.isLoading,
    isSigningOut: signoutState.isLoading,
    isRequestingReset: requestResetState.isLoading,
    isVerifyingReset: verifyResetState.isLoading,
    isSettingPassword: setPasswordState.isLoading,

    // Methods
    signIn,
    signUp,
    verifyOTP,
    socialLogin,
    signOut,
    requestPasswordReset,
    verifyResetOTP,
    setNewPassword,
  };
};
