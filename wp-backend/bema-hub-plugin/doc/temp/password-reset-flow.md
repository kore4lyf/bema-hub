# Password Reset Flow - Frontend Implementation Guide

## Overview
This document explains the updated password reset flow that uses path-based routing for Next.js frontend integration. Users will receive a direct reset link in their email that takes them to the password reset page with the OTP in the URL path.

## New Flow

### 1. User Requests Password Reset
- User enters their email on the password reset page
- Frontend sends request to: `POST /wp-json/bema-hub/v1/auth/reset-password-request`
- Backend generates an OTP code and sends email with reset link

### 2. User Receives Email
- Email contains a "Reset Password" button/link
- Link format: `https://yourfrontend.com/reset-password/123456` (path-based routing)
- No complex tokens are shown to the user, just a simple 6-digit code

### 3. User Clicks Reset Link
- Link opens the password reset page with OTP in the URL path
- Frontend extracts OTP from URL path
- Frontend verifies OTP with backend before showing password reset form

### 4. Frontend Implementation Steps

#### Step 1: Extract OTP from URL Path (Next.js)
```javascript
// For URL: http://localhost:3000/reset-password/123456
// In Next.js page component (e.g., pages/reset-password/[otp].js)
import { useRouter } from 'next/router';

function ResetPasswordPage() {
  const router = useRouter();
  const { otp } = router.query; // Extracts '123456' from the URL
  
  // Verify OTP before showing password form
  useEffect(() => {
    if (otp) {
      verifyOtp(otp);
    }
  }, [otp]);
  
  // ... rest of component
}
```

#### Step 2: Verify OTP with Backend
```javascript
async function verifyOtp(otpCode) {
  try {
    const response = await fetch('/wp-json/bema-hub/v1/auth/verify-password-reset-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@example.com', // User's email (you need to get this from context or local storage)
        otp_code: otpCode // From URL path
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // OTP is valid - show password reset form
      setShowPasswordForm(true);
    } else {
      // Show error and redirect
      showError(data.message || 'Invalid or expired OTP');
      // Redirect to request new reset link
    }
  } catch (error) {
    showError('Network error. Please try again.');
  }
}
```

#### Step 3: Submit New Password
```javascript
async function submitNewPassword(newPassword) {
  try {
    const response = await fetch('/wp-json/bema-hub/v1/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@example.com', // User's email
        otp_code: otp, // From URL parameters
        new_password: newPassword
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Show success message
      showSuccess('Password reset successfully!');
      // Redirect to login page after short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      // Show error message
      showError(data.message || 'Failed to reset password');
    }
  } catch (error) {
    showError('Network error. Please try again.');
  }
}
```

## Admin Configuration

### 1. General Settings
- **Frontend Base URL**: Set the base URL of your frontend application
  - Example: `http://localhost:3000`

### 2. Email Template Settings
- **Password Reset Page URL**: Set the route to your password reset page
  - Example: `reset-password` (relative to frontend base URL)

### 3. OTP Settings
- **Password Reset Daily Limit**: Maximum password reset requests per user per day (1-50 requests)
  - Default: 5 requests per day
- **Email OTP Daily Limit**: Maximum email OTP requests per user per day (1-50 requests)
  - Default: 10 requests per day

## URL Construction
The reset link is constructed as:
```
{FRONTEND_BASE_URL}/{PASSWORD_RESET_PAGE_URL}/{OTP_CODE}
```

Example:
```
http://localhost:3000/reset-password/123456
```

## Backend Endpoints

### Request Reset (User enters email)
```
POST /wp-json/bema-hub/v1/auth/reset-password-request
Body: {email: "user@example.com"}
```

### Verify OTP (Frontend checks if OTP is valid)
```
POST /wp-json/bema-hub/v1/auth/verify-password-reset-otp
Body: {
  email: "user@example.com",
  otp_code: "123456" // From URL path
}
```

### Reset Password (User submits new password)
```
POST /wp-json/bema-hub/v1/auth/reset-password
Body: {
  email: "user@example.com",
  otp_code: "123456", // From URL path
  new_password: "user-entered-password"
}
```

## Security Features
- OTP codes are randomly generated 6-digit numbers
- OTP codes expire after 10 minutes
- OTP codes are single-use (invalidated after successful password reset)
- Rate limiting: Configurable password reset requests per user per 24 hours
- Rate limiting: Configurable email OTP requests per user per 24 hours

## Error Handling
Common error responses from the backend:

### Missing Fields
```json
{
  "code": "missing_fields",
  "message": "Email and OTP code are required",
  "data": {
    "status": 400
  }
}
```

### Invalid Email
```json
{
  "code": "invalid_email",
  "message": "Please provide a valid email address",
  "data": {
    "status": 400
  }
}
```

### User Not Found
```json
{
  "code": "user_not_found",
  "message": "User not found",
  "data": {
    "status": 404
  }
}
```

### Invalid OTP Purpose
```json
{
  "code": "invalid_otp_purpose",
  "message": "Invalid OTP purpose",
  "data": {
    "status": 400
  }
}
```

### OTP Expired
```json
{
  "code": "otp_expired",
  "message": "OTP code has expired. Please request a new one.",
  "data": {
    "status": 400
  }
}
```

### Invalid OTP
```json
{
  "code": "invalid_otp",
  "message": "Invalid OTP code",
  "data": {
    "status": 400
  }
}
```

## Best Practices
1. Always validate URL parameters before showing the password reset form
2. Implement proper password strength validation on the frontend
3. Show loading states during API requests
4. Provide clear success/error messages
5. Redirect users to login page after successful reset
6. Handle OTP expiration gracefully
7. Store user email in local storage or context for easy access during verification