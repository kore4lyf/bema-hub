# Next.js Frontend Integration Summary

This document summarizes all the changes made to support Next.js frontend integration with path-based routing for the Bema Hub plugin.

## Overview

The Bema Hub plugin has been updated to support Next.js frontend integration with path-based routing for password reset flows. This eliminates the need for complex tokens in URLs and provides a cleaner user experience.

## Key Features

### 1. Path-Based Routing Support
- Password reset URLs now use path-based routing: `http://localhost:3000/reset-password/123456`
- OTP codes are embedded directly in the URL path instead of query parameters
- Cleaner URLs that work better with Next.js routing

### 2. New Verification Endpoint
- Added `/wp-json/bema-hub/v1/auth/verify-password-reset-otp` endpoint
- Allows frontend to verify OTP validity before showing password input form
- Returns success response with user ID if OTP is valid
- Returns appropriate error messages for all failure cases

### 3. Configurable Rate Limiting
- Added configurable daily limits for password reset and email OTP requests
- Password Reset Daily Limit: 1-50 requests per day (default: 5)
- Email OTP Daily Limit: 1-50 requests per day (default: 10)
- Configurable through WordPress admin settings

### 4. Enhanced Security
- OTP codes are single-use and expire after 10 minutes
- Rate limiting prevents abuse
- Better error handling and user feedback
- No complex tokens exposed to users

## Implementation Details

### Backend Changes

1. **New REST API Endpoint**
   - Endpoint: `POST /wp-json/bema-hub/v1/auth/verify-password-reset-otp`
   - Purpose: Verify password reset OTP before allowing new password input
   - Location: `includes/rest/controllers/class-bema-hub-otp-controller.php`

2. **Updated Email Template System**
   - Generates path-based URLs for password reset links
   - Stores OTP in user meta for verification
   - Location: `includes/class-bema-hub-mailer.php`

3. **Configurable Rate Limiting**
   - Added new fields to OTP settings in admin
   - Updated OTP controller to use configurable limits
   - Uses user_meta fields for tracking requests
   - Location: `admin/class-bema-hub-admin.php`

4. **Enhanced Rate Limiting Logic**
   - Improved time formatting in error messages
   - Better handling of 24-hour reset cycles
   - Location: `includes/rest/controllers/class-bema-hub-otp-controller.php`

### Frontend Integration

1. **Next.js Page Component**
   ```javascript
   // pages/reset-password/[otp].js
   import { useRouter } from 'next/router';
   
   function ResetPasswordPage() {
     const router = useRouter();
     const { otp } = router.query; // Extracts OTP from URL path
     
     // Verify OTP before showing password form
     useEffect(() => {
       if (otp) {
         verifyOtp(otp);
       }
     }, [otp]);
   }
   ```

2. **OTP Verification**
   ```javascript
   async function verifyOtp(otpCode) {
     try {
       const response = await fetch('/wp-json/bema-hub/v1/auth/verify-password-reset-otp', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           email: 'user@example.com',
           otp_code: otpCode
         })
       });
       
       const data = await response.json();
       
       if (data.success) {
         // OTP is valid - show password reset form
         setShowPasswordForm(true);
       } else {
         // Show error and redirect
         showError(data.message);
       }
     } catch (error) {
       showError('Network error. Please try again.');
     }
   }
   ```

### Admin Configuration

1. **General Settings**
   - Frontend Base URL: Set the base URL of your frontend application
   - Example: `http://localhost:3000`

2. **Email Template Settings**
   - Password Reset Page URL: Set the route to your password reset page
   - Example: `reset-password` (relative to frontend base URL)

3. **OTP Settings**
   - Password Reset Daily Limit: 1-50 requests per day (default: 5)
   - Email OTP Daily Limit: 1-50 requests per day (default: 10)

## URL Construction

The reset link is constructed as:
```
{FRONTEND_BASE_URL}/{PASSWORD_RESET_PAGE_URL}/{OTP_CODE}
```

Example:
```
http://localhost:3000/reset-password/123456
```

## Error Handling

The new endpoint returns appropriate error responses:

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

## Testing

To test the new functionality:

1. Request a password reset through the existing endpoint
2. Check email for path-based reset link
3. Click link to open Next.js frontend
4. Verify OTP with new endpoint
5. Submit new password
6. Login with new password

## Documentation

Updated documentation includes:
- `doc/temp/password-reset-flow.md` - Updated password reset flow guide
- `doc/temp/frontend-password-reset-guide.md` - Frontend implementation guide
- `doc/README.md` - Updated main documentation
- `doc/endpoint-reference.md` - Updated endpoint reference
- `doc/changelog.md` - Changelog with all changes
- This summary document

## Security Considerations

1. OTP codes are randomly generated 6-digit numbers
2. OTP codes expire after 10 minutes
3. OTP codes are single-use
4. Rate limiting prevents abuse
5. No complex tokens exposed to users
6. Proper error handling without exposing sensitive information