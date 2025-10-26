# RTK Query Frontend Patterns for Bema Hub

This document specifically addresses the Redux Toolkit RTK Query patterns used in the frontend implementation for the Bema Hub plugin, as requested.

## Your Implementation Approach

You're using a modern Redux pattern that separates concerns clearly:

### 1. State Management Separation
```javascript
// ✅ Your approach - Separation of concerns
{
  // Local state slices (managed by traditional reducers)
  auth: {
    user: { id, email, name },
    token: "jwt_token",
    isAuthenticated: true,
    pendingUserEmail: null,
    resetUserEmail: null,
    resetToken: null
  },
  
  // API slices (managed by RTK Query)
  authApi: {
    queries: {},
    mutations: {},
    provided: {},
    subscriptions: {},
    config: { ... }
  }
}
```

### 2. API Service Definition
```javascript
// ✅ Your approach - Define API shape, let RTK Query handle everything
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token  // Get token from auth slice
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

### 3. Store Configuration
```javascript
// ✅ Your approach - Combine local reducers with API reducers
export const store = configureStore({
  reducer: {
    // Local state slices
    auth: authReducer,
    ui: uiReducer,
    location: locationReducer,

    // API slices (auto-generated reducers)
    [authApi.reducerPath]: authApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)      // Handles caching/invalidation
      .concat(locationApi.middleware), // Background refetching
})
```

## Bema Hub API Integration Patterns

### Auth API Service for Bema Hub
```javascript
// services/bemaHubApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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

    // OTP Verification (shared for email verification and password reset)
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

    // Password Reset Flow
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
} = bemaHubApi

export default bemaHubApi
```

### Component Usage Patterns

#### Registration Flow
```javascript
// components/RegistrationFlow.jsx
import { useState } from 'react'
import { useSignUpMutation, useVerifyOtpMutation } from '../services/bemaHubApi'
import { useDispatch, useSelector } from 'react-redux'
import { setPendingEmail } from '../store/slices/authSlice'

const RegistrationFlow = () => {
  const dispatch = useDispatch()
  const pendingEmail = useSelector(state => state.auth.pendingUserEmail)
  const [step, setStep] = useState('signup') // 'signup' | 'otp'
  
  // RTK Query mutations with automatic loading states
  const [signUp, { isLoading: isSigningUp, error: signUpError }] = useSignUpMutation()
  const [verifyOtp, { isLoading: isVerifying, error: verifyError }] = useVerifyOtpMutation()

  // Step 1: Register user
  const handleSignup = async (userData) => {
    try {
      const result = await signUp(userData).unwrap()
      dispatch(setPendingEmail(result.user_email))
      setStep('otp')
    } catch (err) {
      console.error('Signup failed:', err)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async ({ email, otpCode }) => {
    try {
      const result = await verifyOtp({ email, otpCode }).unwrap()
      // Handle successful verification (token will be in result)
      // Update auth slice with token and user data
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
          email={pendingEmail}
          onSubmit={handleVerifyOtp}
          loading={isVerifying}
          error={verifyError}
        />
      )}
    </div>
  )
}
```

#### Login Component
```javascript
// components/LoginForm.jsx
import { useSignInMutation } from '../services/bemaHubApi'
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
      <input name="username" required placeholder="Username or Email" />
      <input name="password" type="password" required placeholder="Password" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="error">Error: {error.data?.message}</div>}
    </form>
  )
}
```

#### Password Reset Flow
```javascript
// components/PasswordResetFlow.jsx
import { useState } from 'react'
import { 
  useRequestPasswordResetMutation, 
  useVerifyResetOtpMutation,
  useSetNewPasswordMutation 
} from '../services/bemaHubApi'
import { useDispatch, useSelector } from 'react-redux'
import { setResetEmail } from '../store/slices/authSlice'

const PasswordResetFlow = () => {
  const dispatch = useDispatch()
  const resetEmail = useSelector(state => state.auth.resetUserEmail)
  const [step, setStep] = useState('request') // 'request' | 'otp' | 'new-password'
  
  const [requestReset, { isLoading: requesting }] = useRequestPasswordResetMutation()
  const [verifyOtp, { isLoading: verifying }] = useVerifyResetOtpMutation()
  const [setPassword, { isLoading: settingPassword }] = useSetNewPasswordMutation()

  const handleRequestReset = async ({ email }) => {
    try {
      await requestReset({ email }).unwrap()
      dispatch(setResetEmail(email))
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
          email={resetEmail}
          onSubmit={handleVerifyOtp} 
          loading={verifying} 
        />
      )}
      {step === 'new-password' && (
        <NewPasswordForm 
          email={resetEmail}
          onSubmit={handleSetNewPassword} 
          loading={settingPassword} 
        />
      )}
    </div>
  )
}
```

## Benefits of Your Approach

### 1. Automatic Caching
- Countries fetched once, cached for 1 hour
- No duplicate requests
- Background updates when needed

### 2. Optimistic Updates
- Mutations can update cache immediately
- Rollback on failure

### 3. Loading States
- Per-mutation loading: isLoading, error, data
- No manual loading management

### 4. Performance
- Reduced bundle size (no manual async logic)
- Efficient re-renders (only affected components update)
- Request deduplication

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