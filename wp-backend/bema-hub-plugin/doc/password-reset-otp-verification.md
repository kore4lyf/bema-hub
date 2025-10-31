# Password Reset OTP Verification for Next.js Frontend

This document explains how to use the new OTP verification endpoint for the Next.js frontend password reset flow.

## Endpoint

```
POST /wp-json/bema-hub/v1/auth/verify-password-reset-otp
```

## Purpose

This endpoint allows the Next.js frontend to verify if an OTP code from the URL path is valid and hasn't expired before proceeding to the new password input step.

## Request Format

```json
{
  "email": "user@example.com",
  "otp_code": "123456"
}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "OTP verified successfully. You can now enter your new password.",
  "user_id": 123
}
```

### Error Responses

```json
{
  "code": "missing_fields",
  "message": "Email and OTP code are required",
  "data": {
    "status": 400
  }
}
```

```json
{
  "code": "invalid_email",
  "message": "Please provide a valid email address",
  "data": {
    "status": 400
  }
}
```

```json
{
  "code": "user_not_found",
  "message": "User not found",
  "data": {
    "status": 404
  }
}
```

```json
{
  "code": "invalid_otp_purpose",
  "message": "Invalid OTP purpose",
  "data": {
    "status": 400
  }
}
```

```json
{
  "code": "otp_expired",
  "message": "OTP code has expired. Please request a new one.",
  "data": {
    "status": 400
  }
}
```

```json
{
  "code": "invalid_otp",
  "message": "Invalid OTP code",
  "data": {
    "status": 400
  }
}
```

## Next.js Frontend Integration

### URL Structure

The Next.js frontend should use path-based routing for password reset URLs:

```
http://localhost:3000/reset-password/123456
```

### Flow

1. User clicks on password reset link from email: `http://localhost:3000/reset-password/123456`
2. Next.js frontend extracts the OTP code from the URL path (`123456`)
3. Frontend makes a request to the verify endpoint with the user's email and OTP code
4. If verification is successful, show the new password input form
5. If verification fails, show an appropriate error message

### Example Implementation

```javascript
// pages/reset-password/[otp].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function ResetPassword() {
  const router = useRouter();
  const { otp } = router.query;
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (otp && email) {
      verifyOtp();
    }
  }, [otp, email]);

  const verifyOtp = async () => {
    try {
      const response = await fetch('/api/verify-password-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp_code: otp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsValid(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred while verifying the OTP');
    }
  };

  if (!isValid) {
    return (
      <div>
        <h1>Verify Password Reset</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={verifyOtp}>Verify</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Reset Password</h1>
      {/* Password reset form goes here */}
    </div>
  );
}
```

## Admin Configuration

The password reset daily limit can be configured in the WordPress admin under:

**Bema Hub Settings > OTP Settings**

- **Password Reset Daily Limit**: Maximum password reset requests per user per day (1-50 requests)
- **Email OTP Daily Limit**: Maximum email OTP requests per user per day (1-50 requests)

Default values:
- Password Reset Daily Limit: 5 requests per day
- Email OTP Daily Limit: 10 requests per day

## Rate Limiting

Users are limited to the configured number of password reset requests per 24-hour period. If a user exceeds this limit, they will receive an error message with the time remaining until they can make another request.