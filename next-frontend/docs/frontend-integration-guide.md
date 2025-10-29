# Frontend Integration Guide

This guide explains how to integrate the Bema Hub plugin API endpoints into your frontend application using Redux Toolkit RTK Query with `fetchBaseQuery`.

## Table of Contents

- [Frontend Integration Guide](#frontend-integration-guide)
  - [Table of Contents](#table-of-contents)
  - [Understanding Your Redux Architecture](#understanding-your-redux-architecture)
  - [RTK Query API Service Implementation](#rtk-query-api-service-implementation)
  - [Store Configuration](#store-configuration)
  - [Authentication Flow Implementation](#authentication-flow-implementation)
    - [1. Email Signup with OTP Verification](#1-email-signup-with-otp-verification)
    - [2. Traditional Login](#2-traditional-login)
    - [3. Social Login](#3-social-login)
    - [4. Password Reset Flow](#4-password-reset-flow)
  - [Component Usage Patterns](#component-usage-patterns)
  - [Caching Strategy](#caching-strategy)
  - [Benefits of Your Approach](#benefits-of-your-approach)
    - [1. Automatic Caching](#1-automatic-caching)
    - [2. Optimistic Updates](#2-optimistic-updates)
    - [3. Loading States](#3-loading-states)
    - [4. Performance](#4-performance)
    - [5. Mental Model Shift](#5-mental-model-shift)

## Understanding Your Redux Architecture

Your implementation follows a modern Redux pattern with clear separation of concerns:

1. **Auth Slice**: Manages local application state (user, token, flags)
2. **API Slices**: Handle all server communication and caching
3. **No Manual Async Logic**: RTK Query manages all async operations automatically

```
// Key Conceptual Differences from Traditional Approaches

// ❌ Old Thinking: Manual async thunks with manual state management
const login = createAsyncThunk('auth/login', async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
  return response.json()
})

// ✅ Your Approach: Define API shape, let RTK Query handle everything
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: ({ email, password }) => ({
        url: 'login',
        method: 'POST',
        body: { email, password },
      }),
    }),
  }),
})
```

## RTK Query API Service Implementation

Here's how to implement the Bema Hub API endpoints using your RTK Query pattern:

```
// services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// API base configuration
export const bemaHubApi = createApi({
  reducerPath: 'bemaHubApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://yoursite.com/wp-json/bema-hub/v1',
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth slice (not localStorage)
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Auth', 'Profile', 'Location'],
  endpoints: (builder) => ({
    // User Registration
    signUp: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),

    // OTP Verification
    verifyOtp: builder.mutation({
      query: ({ email, otpCode }) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: { 
          email, 
          otp_code: otpCode 
        },
      }),
    }),

    // Traditional Login
    signIn: builder.mutation({
      query: ({ username, password }) => ({
        url: '/auth/signin',
        method: 'POST',
        body: { username, password },
      }),
    }),

    // Social Login
    socialLogin: builder.mutation({
      query: (socialData) => ({
        url: '/auth/social-login',
        method: 'POST',
        body: socialData,
      }),
    }),

    // Signout
    signOut: builder.mutation({
      query: () => ({
        url: '/auth/signout',
        method: 'POST',
      }),
    }),

    // Password Reset Request
    requestPasswordReset: builder.mutation({
      query: ({ email }) => ({
        url: '/auth/reset-password-request',
        method: 'POST',
        body: { email },
      }),
    }),

    // Password Reset Verification
    verifyResetOtp: builder.mutation({
      query: ({ email, otpCode }) => ({
        url: '/auth/reset-password-verify',
        method: 'POST',
        body: { 
          email, 
          otp_code: otpCode 
        },
      }),
    }),

    // Set New Password
    setNewPassword: builder.mutation({
      query: ({ email, otpCode, newPassword }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { 
          email, 
          otp_code: otpCode,
          new_password: newPassword
        },
      }),
    }),

    // User Profile (Protected)
    getProfile: builder.query({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),

    // Countries List (for location data)
    getCountries: builder.query({
      query: () => '/countries',
      keepUnusedDataFor: 3600, // Cache for 1 hour
      providesTags: ['Location'],
    }),
  }),
})

// Export auto-generated hooks
export const {
  useSignUpMutation,
  useVerifyOtpMutation,
  useSignInMutation,
  useSocialLoginMutation,
  useSignOutMutation,
  useRequestPasswordResetMutation,
  useVerifyResetOtpMutation,
  useSetNewPasswordMutation,
  useGetProfileQuery,
  useGetCountriesQuery,
} = bemaHubApi

export default bemaHubApi
```

## Store Configuration

Configure your Redux store to include both your local state slices and API slices:

```
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import locationReducer from './slices/locationSlice'
import { bemaHubApi } from '../services/api'

export const store = configureStore({
  reducer: {
    // Local state slices
    auth: authReducer,
    ui: uiReducer,
    location: locationReducer,

    // API slices (auto-generated reducers)
    [bemaHubApi.reducerPath]: bemaHubApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(bemaHubApi.middleware), // Handles caching/invalidation
})

// State Structure:
{
  // Local application state
  auth: {
    user: { id, email, name },
    token: "jwt_token",
    isAuthenticated: true
  },

  // RTK Query managed state (automatic)
  bemaHubApi: {
    queries: {},
    mutations: {},
    provided: {},
    subscriptions: {},
    config: { ... }
  }
}
```

## Authentication Flow Implementation

Here's how to implement the complete authentication flows using your approach:

### 1. Email Signup with OTP Verification

```
// components/SignupFlow.jsx
import { useState } from 'react'
import { useSignUpMutation, useVerifyOtpMutation } from '../services/api'
import { useDispatch } from 'react-redux'
import { setCredentials, setPendingEmail } from '../store/slices/authSlice'

const SignupFlow = () => {
  const dispatch = useDispatch()
  const [step, setStep] = useState('signup') // 'signup' | 'otp'
  const [userEmail, setUserEmail] = useState('') // Store email in component state
  
  // RTK Query mutations with automatic loading states
  const [signUp, { isLoading: isSigningUp, error: signUpError }] = useSignUpMutation()
  const [verifyOtp, { isLoading: isVerifying, error: verifyError }] = useVerifyOtpMutation()

  // Step 1: Register user
  const handleSignup = async (userData) => {
    try {
      const result = await signUp(userData).unwrap()
      setUserEmail(result.user_email) // Store email in component state
      setStep('otp')
    } catch (err) {
      console.error('Signup failed:', err)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async ({ email, otpCode }) => {
    try {
      const result = await verifyOtp({ email, otpCode }).unwrap()
      dispatch(setCredentials({ 
        user: result.user, 
        token: result.token 
      }))
      // Redirect to dashboard
    } catch (err) {
      console.error('OTP verification failed:', err)
    }
  }

  return (
    <div>
      {step === 'signup' && (
        <SignupForm 
          onSubmit={handleSignup} 
          loading={isSigningUp}
          error={signUpError}
        />
      )}
      {step === 'otp' && (
        <OtpVerificationForm 
          email={userEmail} // Use component state instead of Redux
          onSubmit={handleVerifyOtp}
          loading={isVerifying}
          error={verifyError}
        />
      )}
    </div>
  )
}
```

### 2. Traditional Login

```
// components/LoginForm.jsx
import { useSignInMutation } from '../services/api'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [signIn, { isLoading, error }] = useSignInMutation()

  const handleSubmit = async (credentials) => {
    try {
      const result = await signIn(credentials).unwrap()
      dispatch(setCredentials({ 
        user: result.user, 
        token: result.token 
      }))
      // Redirect to dashboard
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const data = new FormData(e.target)
      handleSubmit({
        username: data.get('username'),
        password: data.get('password')
      })
    }}>
      <input name="username" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div>Error: {error.data?.message}</div>}
    </form>
  )
}
```

### 3. Social Login

```
// components/SocialLoginButtons.jsx
import { useSocialLoginMutation } from '../services/api'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice'

const SocialLoginButtons = () => {
  const dispatch = useDispatch()
  const [socialLogin, { isLoading, error }] = useSocialLoginMutation()

  const handleSocialLogin = async (providerData) => {
    try {
      const result = await socialLogin(providerData).unwrap()
      dispatch(setCredentials({ 
        user: result.user, 
        token: result.token 
      }))
      // Redirect to dashboard
    } catch (err) {
      console.error('Social login failed:', err)
    }
  }

  return (
    <div>
      <button 
        onClick={() => handleSocialLogin({ provider: 'google', /* ... */ })}
        disabled={isLoading}
      >
        Sign in with Google
      </button>
      <button 
        onClick={() => handleSocialLogin({ provider: 'facebook', /* ... */ })}
        disabled={isLoading}
      >
        Sign in with Facebook
      </button>
    </div>
  )
}
```

### 4. Password Reset Flow

```
// components/PasswordResetFlow.jsx
import { useState } from 'react'
import { 
  useRequestPasswordResetMutation, 
  useVerifyResetOtpMutation,
  useSetNewPasswordMutation 
} from '../services/api'
import { useDispatch } from 'react-redux'

const PasswordResetFlow = () => {
  const dispatch = useDispatch()
  const [step, setStep] = useState('request') // 'request' | 'otp' | 'new-password'
  const [userEmail, setUserEmail] = useState('') // Store email in component state
  
  const [requestReset, { isLoading: requesting }] = useRequestPasswordResetMutation()
  const [verifyOtp, { isLoading: verifying }] = useVerifyResetOtpMutation()
  const [setPassword, { isLoading: settingPassword }] = useSetNewPasswordMutation()

  const handleRequestReset = async ({ email }) => {
    try {
      await requestReset({ email }).unwrap()
      setUserEmail(email) // Store email in component state
      setStep('otp')
    } catch (err) {
      console.error('Reset request failed:', err)
    }
  }

  const handleVerifyOtp = async ({ email, otpCode }) => {
    try {
      await verifyOtp({ email, otpCode }).unwrap()
      setStep('new-password')
    } catch (err) {
      console.error('OTP verification failed:', err)
    }
  }

  const handleSetNewPassword = async ({ email, otpCode, newPassword }) => {
    try {
      await setPassword({ email, otpCode, newPassword }).unwrap()
      // Redirect to login
    } catch (err) {
      console.error('Password update failed:', err)
    }
  }

  return (
    <div>
      {step === 'request' && (
        <ResetRequestForm onSubmit={handleRequestReset} loading={requesting} />
      )}
      {step === 'otp' && (
        <ResetOtpForm 
          email={userEmail} // Use component state instead of Redux
          onSubmit={handleVerifyOtp} 
          loading={verifying} 
        />
      )}
      {step === 'new-password' && (
        <NewPasswordForm 
          email={userEmail} // Use component state instead of Redux
          onSubmit={handleSetNewPassword} 
          loading={settingPassword} 
        />
      )}
    </div>
  )
}
```

## Component Usage Patterns

Your RTK Query approach provides clean, predictable usage patterns:

```
// Automatic Loading States
const [signIn, { isLoading, error, data }] = useSignInMutation()

// Error Handling
{error && <div>{error.data?.message || 'An error occurred'}</div>}

// Request Deduplication
// Multiple components using the same query will share one request

// Caching
// Queries automatically cache results based on your configuration

// Background Updates
// RTK Query can refetch data in background when needed
```

## Caching Strategy

Your implementation leverages RTK Query's sophisticated caching:

```
export const locationApi = createApi({
  keepUnusedDataFor: 300, // 5 minutes default
  refetchOnFocus: false,   // No refetch on window focus
  refetchOnReconnect: false, // No refetch on reconnect
  endpoints: (builder) => ({
    getCountries: builder.query({
      query: () => 'countries',
      keepUnusedDataFor: 3600, // Countries cached 1 hour
      providesTags: ['Country'],
    }),
  }),
})
```

Benefits:
- Countries fetched once, cached for 1 hour
- No duplicate requests
- Background updates when needed
- Efficient re-renders (only affected components update)

## Benefits of Your Approach

### 1. Automatic Caching
- ✅ Countries fetched once, cached for 1 hour
- ✅ No duplicate requests
- ✅ Background updates when needed

### 2. Optimistic Updates
- ✅ Mutations can update cache immediately
- ✅ Rollback on failure

### 3. Loading States
- ✅ Per-mutation loading: isLoading, error, data
- ✅ No manual loading management

### 4. Performance
- ✅ Reduced bundle size (no manual async logic)
- ✅ Efficient re-renders (only affected components update)
- ✅ Request deduplication

### 5. Mental Model Shift
**Old Thinking**: "I need to fetch data and manage loading/error states"
**New Thinking**: "I need to define what data looks like and how to get it"

RTK Query handles:
- ✅ Fetching
- ✅ Caching
- ✅ Loading states
- ✅ Error handling
- ✅ Background updates
- ✅ Request deduplication

This approach eliminated ~200 lines of thunk boilerplate and gave you professional-grade caching and state management.
