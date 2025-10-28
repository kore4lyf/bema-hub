import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  SignupRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  SigninRequest,
  SocialLoginRequest,
  ValidateTokenRequest,
  ResetPasswordRequestRequest,
  ResetPasswordVerifyRequest,
  ResetPasswordFinalRequest,
  UpdateProfileRequest,
  AuthResponse,
  SignupResponse,
  VerifyOtpResponse,
  SigninResponse,
  SocialLoginResponse,
  SignoutResponse,
  ValidateTokenResponse,
  ResetPasswordRequestResponse,
  ResetPasswordVerifyResponse,
  ResetPasswordResponse,
  ProfileResponse
} from './types'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/wp-json/bema-hub/v1/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User', 'Profile'],
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (data) => ({ url: 'auth/signup', method: 'POST', body: data }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (data) => ({ url: 'auth/verify-otp', method: 'POST', body: data }),
    }),
    resendOtp: builder.mutation<VerifyOtpResponse, ResendOtpRequest>({
      query: (data) => ({ url: 'auth/resend-otp', method: 'POST', body: data }),
    }),
    signin: builder.mutation<SigninResponse, SigninRequest>({
      query: (data) => ({ url: 'auth/signin', method: 'POST', body: data }),
    }),
    socialLogin: builder.mutation<SocialLoginResponse, SocialLoginRequest>({
      query: (data) => ({ url: 'auth/social-login', method: 'POST', body: data }),
    }),
    signout: builder.mutation<SignoutResponse, void>({
      query: () => ({ url: 'auth/signout', method: 'POST' }),
    }),
    validate: builder.mutation<ValidateTokenResponse, ValidateTokenRequest>({
      query: (data) => ({ url: 'auth/validate', method: 'POST', body: data }),
    }),
    resetPasswordRequest: builder.mutation<ResetPasswordRequestResponse, ResetPasswordRequestRequest>({
      query: (data) => ({ url: 'auth/reset-password-request', method: 'POST', body: data }),
    }),
    resetPasswordVerify: builder.mutation<ResetPasswordVerifyResponse, ResetPasswordVerifyRequest>({
      query: (data) => ({ url: 'auth/reset-password-verify', method: 'POST', body: data }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordFinalRequest>({
      query: (data) => ({ url: 'auth/reset-password', method: 'POST', body: data }),
    }),
    getProfile: builder.query<ProfileResponse, void>({
      query: () => 'profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<ProfileResponse, UpdateProfileRequest>({
      query: (data) => ({ url: 'profile', method: 'PUT', body: data }),
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const {
  useSignupMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useSigninMutation,
  useSocialLoginMutation,
  useSignoutMutation,
  useValidateMutation,
  useResetPasswordRequestMutation,
  useResetPasswordVerifyMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi