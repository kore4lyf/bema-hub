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
  ProfileResponse,
  ValidateTokenResponse
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
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (data) => ({ url: 'auth/signup', method: 'POST', body: data }),
    }),
    verifyOtp: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (data) => ({ url: 'auth/verify-otp', method: 'POST', body: data }),
    }),
    resendOtp: builder.mutation<AuthResponse, ResendOtpRequest>({
      query: (data) => ({ url: 'auth/resend-otp', method: 'POST', body: data }),
    }),
    signin: builder.mutation<AuthResponse, SigninRequest>({
      query: (data) => ({ url: 'auth/signin', method: 'POST', body: data }),
    }),
    socialLogin: builder.mutation<AuthResponse, SocialLoginRequest>({
      query: (data) => ({ url: 'auth/social-login', method: 'POST', body: data }),
    }),
    signout: builder.mutation<AuthResponse, void>({
      query: () => ({ url: 'auth/signout', method: 'POST' }),
    }),
    validate: builder.mutation<ValidateTokenResponse, ValidateTokenRequest>({
      query: (data) => ({ url: 'auth/validate', method: 'POST', body: data }),
    }),
    resetPasswordRequest: builder.mutation<AuthResponse, ResetPasswordRequestRequest>({
      query: (data) => ({ url: 'auth/reset-password-request', method: 'POST', body: data }),
    }),
    resetPasswordVerify: builder.mutation<AuthResponse, ResetPasswordVerifyRequest>({
      query: (data) => ({ url: 'auth/reset-password-verify', method: 'POST', body: data }),
    }),
    resetPassword: builder.mutation<AuthResponse, ResetPasswordFinalRequest>({
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
