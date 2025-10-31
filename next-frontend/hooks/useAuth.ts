import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { 
  useSigninMutation, 
  useSignupMutation, 
  useVerifyOtpMutation,
  useSocialLoginMutation,
  useSignoutMutation,
  useResetPasswordRequestMutation,
  useVerifyPasswordResetOtpMutation,
  useResetPasswordMutation
} from '@/lib/api/authApi';
import { 
  setCredentials, 
  signOut as signOutAction, 
  logout
} from '@/lib/features/auth/authSlice';
import { RootState } from '@/lib/store';
import { toast } from 'sonner';
import type {
  SigninRequest,
  VerifyOtpRequest,
  ResetPasswordVerifyRequest,
  ResetPasswordFinalRequest
} from '@/lib/api/types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  // RTK Query hooks
  const [signInMutation, signInState] = useSigninMutation();
  const [registerMutation, registerState] = useSignupMutation();
  const [verifyOTPMutation, verifyOTPState] = useVerifyOtpMutation();
  const [socialLoginMutation, socialLoginState] = useSocialLoginMutation();
  const [signoutMutation, signoutState] = useSignoutMutation();
  const [requestResetMutation, requestResetState] = useResetPasswordRequestMutation();
  const [verifyResetMutation, verifyResetState] = useVerifyPasswordResetOtpMutation();
  const [setPasswordMutation, setPasswordState] = useResetPasswordMutation();

  // Unified auth methods
  const signIn = async (credentials: { email: string; password: string }) => {
    try {
      const result = await signInMutation({
        username: credentials.email,
        password: credentials.password
      } as SigninRequest).unwrap();
      dispatch(setCredentials({
        authData: result
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
      dispatch(setCredentials({ authData: result }));
      toast.success('Registration successful! Please check your email for OTP.');
      return result;
    } catch (error: any) {
      toast.error(error.data?.message || 'Registration failed');
      throw error;
    }
  };

  const verifyOTP = async (data: { email: string; otpCode: string }) => {
    try {
      const result = await verifyOTPMutation({
        email: data.email,
        otp_code: data.otpCode
      } as VerifyOtpRequest).unwrap();
      dispatch(setCredentials({
        authData: result
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
        authData: result
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
      dispatch(signOutAction());
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
      toast.success('Reset code sent to your email');
      return true;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to send reset code');
      throw error;
    }
  };

  const verifyResetOTP = async (data: { email: string; otpCode: string }) => {
    try {
      const result = await verifyResetMutation({
        email: data.email,
        otp_code: data.otpCode
      } as ResetPasswordVerifyRequest).unwrap();
      toast.success('OTP verified successfully');
      return result;
    } catch (error: any) {
      toast.error(error.data?.message || 'Invalid OTP');
      throw error;
    }
  };

  const setNewPassword = async (data: { email: string; otpCode: string; newPassword: string }) => {
    try {
      await setPasswordMutation({
        email: data.email,
        otp_code: data.otpCode,
        new_password: data.newPassword
      } as ResetPasswordFinalRequest).unwrap();
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
    authData: auth.authData,
    isAuthenticated: auth.isAuthenticated,

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