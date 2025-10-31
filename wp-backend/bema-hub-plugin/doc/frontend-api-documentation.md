# Frontend API Documentation - Recent Changes

## Overview
This document provides frontend developers with the information needed to integrate with the recently enhanced Bema Hub plugin endpoints. The changes include improved error handling, rate limiting, and separate limits for password reset requests.

## 1. Password Reset Request Endpoint

### Endpoint
```
POST /wp-json/bema-hub/v1/reset-password-request
```

### Request Body
```json
{
  "email": "user@example.com"
}
```

### Success Response
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset code has been sent."
}
```

### Error Responses
```json
{
  "code": "missing_email",
  "message": "Email is required",
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
  "code": "password_reset_request_limit_exceeded",
  "message": "You have exceeded the maximum password reset request limit. Please try again in 2 hours, 15 minutes.",
  "data": {
    "status": 429
  }
}
```

### Notes
- The endpoint always returns a success response for security reasons, even if the email doesn't exist
- Rate limiting is applied: 5 requests per 24 hours per user (configurable in admin settings)
- Time remaining in rate limit messages is formatted in a human-readable way

## 2. Resend OTP Endpoint

### Endpoint
```
POST /wp-json/bema-hub/v1/resend-otp
```

### Request Body
```json
{
  "email": "user@example.com"
}
```

### Success Response
```json
{
  "success": true,
  "message": "A new verification code has been sent to your email."
}
```

### Error Responses
```json
{
  "code": "missing_email",
  "message": "Email is required",
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
  "code": "otp_request_limit_exceeded",
  "message": "You have exceeded the maximum OTP request limit. Please try again in 1 hour, 30 minutes.",
  "data": {
    "status": 429
  }
}
```

### Notes
- Rate limiting is applied: 10 requests per 24 hours per user (configurable in admin settings)
- Time remaining in rate limit messages is formatted in a human-readable way

## 3. Verify OTP Endpoint

### Endpoint
```
POST /wp-json/bema-hub/v1/verify-otp
```

### Request Body
```json
{
  "email": "user@example.com",
  "otp_code": "123456"
}
```

### Success Response (Email Verification)
```json
{
  "success": true,
  "message": "Email verified successfully",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user_id": 123,
  "user_login": "username",
  "user_email": "user@example.com",
  "user_display_name": "User Name"
}
```

### Success Response (Password Reset)
```json
{
  "success": true,
  "message": "Password reset code verified successfully",
  "reset_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
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

## 4. Authentication Endpoint

### Endpoint
```
POST /wp-json/bema-hub/v1/auth/login
```

### Request Body
```json
{
  "username_or_email": "username_or_email",
  "password": "password"
}
```

### Success Response
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user_id": 123,
  "user_login": "username",
  "user_email": "user@example.com",
  "user_display_name": "User Name",
  "first_name": "First",
  "last_name": "Last",
  "avatar_url": "https://secure.gravatar.com/avatar/...",
  "bema_email_verified": true,
  "bema_referred_by": "",
  "role": "subscriber"
}
```

### Error Responses
```json
{
  "code": "incorrect_password",
  "message": "The password you entered is incorrect. Please try again.",
  "data": {
    "status": 401
  }
}
```

```json
{
  "code": "invalid_username",
  "message": "Invalid username or email address. Please check and try again.",
  "data": {
    "status": 401
  }
}
```

## 5. Rate Limiting Information

### Password Reset Requests
- Limit: 5 requests per 24 hours (configurable)
- User Meta Fields:
  - `bema_password_reset_request_count`: Tracks request count
  - `bema_last_password_reset_request`: Timestamp of last request

### OTP Requests
- Limit: 10 requests per 24 hours (configurable)
- User Meta Fields:
  - `bema_email_otp_request_count`: Tracks request count
  - `bema_last_successful_email_otp_request`: Timestamp of last request

### Time Formatting
Rate limit error messages include human-readable time formatting:
- Examples: "2 hours, 30 minutes", "15 minutes, 45 seconds", "3 hours"

## 6. Admin Settings

The following settings can be adjusted in the WordPress admin panel under "Bema Hub Settings" → "OTP Settings":

- Daily OTP Request Limit: 1-100 requests per day (default: 10)
- Daily Password Reset Limit: 1-50 requests per day (default: 5)

## 7. Error Handling

All error responses follow the standard WordPress REST API format:
```json
{
  "code": "error_code",
  "message": "Error message",
  "data": {
    "status": 400
  }
}
```

### Clean Error Messages
All authentication errors have been sanitized to remove HTML content and provide user-friendly messages:
- No HTML tags in error messages
- Clear, descriptive error messages
- Consistent formatting across all endpoints

## 8. Implementation Notes

### Security Considerations
- All endpoints implement proper rate limiting
- Password reset requests don't reveal if an email exists
- OTP codes are properly hashed before storage
- JWT tokens are securely generated and validated

### User Experience
- Human-readable time formatting in rate limit messages
- Consistent response structures
- Clear error messages without technical jargon
- Proper HTTP status codes for different error types