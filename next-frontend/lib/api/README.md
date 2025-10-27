# Bema Hub API Integration

This directory contains the RTK Query API implementation for the Bema Hub platform, providing typed hooks for all backend endpoints.

## Files

- [authApi.ts](file:///c%3A/Users/akfal/Documents/bema-hub/next-frontend/lib/api/authApi.ts) - Main API implementation with typed endpoints
- [types.ts](file:///c%3A/Users/akfal/Documents/bema-hub/next-frontend/lib/api/types.ts) - TypeScript interfaces for all request/response bodies
- [USAGE.md](file:///c%3A/Users/akfal/Documents/bema-hub/next-frontend/lib/api/USAGE.md) - Detailed usage examples for all API hooks

## Endpoints

All endpoints are fully typed with TypeScript interfaces based on the official Bema Hub API documentation.

### Authentication
- `useSignupMutation` - Register a new user
- `useVerifyOtpMutation` - Verify OTP codes
- `useSigninMutation` - User authentication
- `useSocialLoginMutation` - Social provider authentication
- `useSignoutMutation` - User signout
- `useValidateMutation` - Validate JWT tokens
- `useResetPasswordRequestMutation` - Initiate password reset
- `useResetPasswordVerifyMutation` - Verify password reset OTP
- `useResetPasswordMutation` - Complete password reset

### User Profile
- `useGetProfileQuery` - Fetch authenticated user's profile
- `useUpdateProfileMutation` - Update user profile information

## Usage

The API is already integrated into the Redux store. You can use the hooks directly in your components:

```typescript
import { useGetProfileQuery, useSigninMutation } from '@/lib/api/authApi'

// In a component or custom hook
const { data: profile, isLoading } = useGetProfileQuery()
const [signin, { isLoading: isSigningIn }] = useSigninMutation()
```

See [USAGE.md](file:///c%3A/Users/akfal/Documents/bema-hub/next-frontend/lib/api/USAGE.md) for detailed examples of how to use each endpoint.