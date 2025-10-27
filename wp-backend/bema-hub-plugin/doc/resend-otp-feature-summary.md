# Resend OTP Feature Summary

## Overview
This document summarizes the implementation of the resend OTP feature that allows users to request a new OTP code when their previous one has expired or been lost.

## Feature Implementation

### 1. New Endpoint
- **Endpoint**: `POST /wp-json/bema-hub/v1/auth/resend-otp`
- **Purpose**: Resend OTP codes for both email verification (signup) and password reset scenarios
- **Authentication**: No authentication required (pre-authentication endpoint)

### 2. Controller Implementation
- **File**: `includes/rest/controllers/class-bema-hub-otp-controller.php`
- **Method**: `resend_otp()`
- **Logic**:
  1. Validates email parameter
  2. Retrieves user by email
  3. Detects user's current state (email verification or password reset)
  4. Generates new 6-digit OTP code
  5. Hashes OTP with SHA256 before storage
  6. Stores OTP with 10-minute expiration
  7. Maintains the same OTP purpose as previous OTP
  8. Returns appropriate success message

### 3. Route Registration
- **File**: `includes/rest/class-bema-hub-rest-api.php`
- **Route**: `/auth/resend-otp`
- **Method**: POST
- **Callback**: `Bema_Hub_OTP_Controller::resend_otp`
- **Permission**: Public (no authentication required)

## Technical Details

### OTP Generation Process
1. **Code Generation**: 6-digit random number (`rand(100000, 999999)`)
2. **Expiration**: 10 minutes from generation time (`time() + 600`)
3. **Storage**: SHA256 hashed before storage in user meta fields
4. **Purpose Tracking**: Maintains existing purpose (`email_verification` or `password_reset`)

### User State Detection
The endpoint automatically determines the appropriate OTP purpose:
- If user has active OTP: Maintains same purpose
- If no active OTP but email not verified: Assumes email verification
- If no active OTP and email verified: Returns error

### Security Features
- **Email Enumeration Prevention**: Appropriate error messages for non-existent users
- **OTP Security**: SHA256 hashing before storage
- **Expiration**: 10-minute OTP lifetime
- **Logging**: All events logged for security monitoring
- **Rate Limiting**: Should be implemented at server level

## Response Messages
The endpoint returns context-appropriate messages:
- Email verification: "A new email verification code has been sent to your email."
- Password reset: "A new password reset code has been sent to your email."
- General: "A new verification code has been sent to your email."

## Error Handling
- **Missing Email**: 400 Bad Request
- **Invalid Email Format**: 400 Bad Request
- **User Not Found**: 404 Not Found
- **No Active OTP**: 400 Bad Request

## Documentation
- **Endpoint Documentation**: `doc/endpoint-auth-resend-otp.md`
- **Reference Update**: `doc/endpoint-reference.md`
- **Route Verification**: Updated in REST API class

## Testing
The endpoint has been implemented following the existing patterns and should work consistently with other OTP-related endpoints.