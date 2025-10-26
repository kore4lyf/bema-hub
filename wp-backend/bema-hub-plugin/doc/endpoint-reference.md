# Bema Hub API Endpoint Reference

This document provides a comprehensive reference for all Bema Hub API endpoints, including sample request bodies and expected responses.

## Table of Contents
- [Bema Hub API Endpoint Reference](#bema-hub-api-endpoint-reference)
  - [Table of Contents](#table-of-contents)
  - [Authentication Endpoints](#authentication-endpoints)
    - [Signup](#signup)
    - [Verify OTP](#verify-otp)
    - [Login](#login)
    - [Social Login](#social-login)
    - [Signout](#signout)
    - [Validate Token](#validate-token)
    - [Reset Password Request](#reset-password-request)
    - [Reset Password Verify](#reset-password-verify)
    - [Reset Password](#reset-password)
  - [Protected Endpoints](#protected-endpoints)
    - [Get User Profile](#get-user-profile)
    - [Update User Profile](#update-user-profile)

## Authentication Endpoints

### Signup

**Endpoint**: `POST /wp-json/bema-hub/v1/auth/signup`

**Description**: Register a new user account with email verification. This endpoint creates a new user in the WordPress system and sends an OTP code for email verification.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "country": "United States",
  "state": "New York",
  "referred_by": "R-SOS2026-123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Account created successfully. Please check your email for verification code.",
  "user_email": "user@example.com"
}
```

**Error Responses**:
- Missing Required Fields (400)
- Invalid Email Format (400)
- Email Already Exists (400)
- User Creation Failed (500)

---

### Verify OTP

**Endpoint**: `POST /wp-json/bema-hub/v1/auth/verify-otp`

**Description**: Verify the OTP code sent to a user's email or phone. This endpoint is used for email verification during signup, phone verification, and password reset. No authentication is required as it's used in all scenarios.

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp_code": "123456"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Error Responses**:
- Missing Required Fields (400)
- Invalid Email Format (400)
- User Not Found (404)
- OTP Expired (400)
- Invalid OTP (400)

---

### Login

**Endpoint**: `POST /wp-json/bema-hub/v1/auth/signin`

**Description**: Authenticate users with their username or email address and password, then returns a JWT token for subsequent authorized requests.

**Request Body**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Success Response (200)**:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MTYxNjE2MTYsIm5iZiI6MTYxNjE2MTYxNiwiZXhwIjoxNjE2NzY2NDE2LCJkYXRhIjp7InVzZXJfaWQiOjEsInVzZXJfbG9naW4iOiJhZG1pbiIsInVzZXJfZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSJ9fQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "user_id": 1,
  "user_login": "admin",
  "user_email": "admin@example.com",
  "user_display_name": "Administrator",
  "avatar_url": "https://secure.gravatar.com/avatar/23463b99b62a72f26ed677cc556c44e8?s=96&d=mm&r=g"
}
```

**Error Responses**:
- Authentication Failed (401)
- Missing Parameters (400)
- Invalid Parameter Types (400)

---

### Social Login

**Endpoint**: `POST /wp-json/bema-hub/v1/auth/social-login`

**Description**: Authenticate users through social providers (Google, Facebook, Twitter). This endpoint handles both new user registration and existing user login through social authentication.

**Request Body**:
```json
{
  "provider": "google",
  "provider_id": "1234567890",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "country": "United States",
  "state": "New York"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": 123,
  "user_login": "user_example_com",
  "user_email": "user@example.com",
  "user_display_name": "John Doe",
  "avatar_url": "https://secure.gravatar.com/avatar/23463b99b62a72f26ed677cc556c44e8?s=96&d=mm&r=g"
}
```

**Error Responses**:
- Missing Required Fields (400)
- Invalid Provider (400)
- User Creation Failed (500)

---

### Signout

**Endpoint**: `POST /wp-json/bema-hub/v1/auth/signout`

**Description**: Signs out the currently authenticated user by invalidating their JWT token and logging the signout event.

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**: None

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Successfully signed out"
}
```

**Error Responses**:
- Invalid or Missing Token (401)
- Expired Token (401)
- User Not Found (404)

---

### Validate Token

**Endpoint**: `POST /wp-json/bema-hub/v1/auth/validate`

**Description**: Validates a JWT token to check if it's still valid and hasn't expired.

**Request Body**:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Success Response (200)**:
```json
{
  "valid": true,
  "data": {
    "user_id": 1,
    "user_login": "admin",
    "user_email": "admin@example.com",
    "avatar_url": "https://secure.gravatar.com/avatar/23463b99b62a72f26ed677cc556c44e8?s=96&d=mm&r=g"
  }
}
```

**Error Responses**:
- Expired Token (401)
- Invalid Token (401)
- Missing Token (400)

---

### Reset Password Request

**Endpoint**: `POST /wp-json/bema-hub/v1/auth/reset-password-request`

**Description**: Initiates the password reset process by sending an OTP code to the user's email address.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset code has been sent."
}
```

**Error Responses**:
- Missing Email (400)
- Invalid Email Format (400)

---

### Reset Password Verify

**Endpoint**: `POST /wp-json/bema-hub/v1/auth/reset-password-verify`

**Description**: Verifies the OTP code sent to the user's email during the password reset process. No authentication is required.

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp_code": "123456"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Password reset code verified successfully"
}
```

**Error Responses**:
- Missing Fields (400)
- Invalid Email Format (400)
- User Not Found (404)
- No OTP Found (400)
- Expired OTP (400)
- Invalid OTP (400)

---

### Reset Password

**Endpoint**: `POST /wp-json/bema-hub/v1/auth/reset-password`

**Description**: Sets a new password for the user after successful OTP verification. User must then login with the new password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp_code": "123456",
  "new_password": "newSecurePassword123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Password has been reset successfully. Please login with your new password."
}
```

**Error Responses**:
- Missing Fields (400)
- Weak Password (400)
- Invalid OTP (400)
- User Not Found (404)

---

## Protected Endpoints

### Get User Profile

**Endpoint**: `GET /wp-json/bema-hub/v1/profile`

**Description**: Returns the profile information of the authenticated user, including all custom user meta fields and WordPress avatar.

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**: None

**Success Response (200)**:
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "display_name": "Administrator",
  "first_name": "Admin",
  "last_name": "User",
  "avatar_url": "https://secure.gravatar.com/avatar/23463b99b62a72f26ed677cc556c44e8?s=96&d=mm&r=g",
  "bema_phone_number": "UzJWbWMzQnBjeUF4TURB",
  "bema_country": "United States",
  "bema_state": "New York",
  "bema_referred_by": "R-SOS2026-123",
  "bema_tier_level": "Opt-In",
  "bema_account_type": "subscriber",
  "bema_email_verified": true,
  "bema_phone_verified": false,
  "bema_fraud_flag": false,
  "bema_device_id": "device_5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f",
  "bema_last_signin": 1609459200,
  "bema_last_signout": 1609459200,
  "bema_google_id": "123456789012345678901",
  "bema_facebook_id": "1234567890123456",
  "bema_twitter_id": "123456789"
}
```

**Error Responses**:
- Missing Authorization Header (401)
- Invalid Authorization Header Format (401)
- Invalid Token (401)
- Expired Token (401)
- User Not Found (404)

---

### Update User Profile

**Endpoint**: `PUT /wp-json/bema-hub/v1/profile`

**Description**: Updates the profile information of the authenticated user. Note that `bema_referred_by` cannot be updated as it's only set during signup.

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "display_name": "John Doe",
  "bema_phone_number": "+1234567890",
  "bema_country": "United States",
  "bema_state": "California"
}
```

**Success Response (200)**:
```json
{
  "id": 123,
  "username": "user_example_com",
  "email": "user@example.com",
  "display_name": "John Doe",
  "first_name": "John",
  "last_name": "Doe",
  "avatar_url": "https://secure.gravatar.com/avatar/23463b99b62a72f26ed677cc556c44e8?s=96&d=mm&r=g",
  "bema_phone_number": "UzJWbWMzQnBjeUF4TURB",
  "bema_country": "United States",
  "bema_state": "California",
  "bema_referred_by": "R-SOS2026-123",
  "bema_tier_level": "Opt-In",
  "bema_account_type": "subscriber",
  "bema_email_verified": true,
  "bema_phone_verified": true,
  "bema_fraud_flag": false,
  "bema_device_id": "device_5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f",
  "bema_last_signin": 1609459200,
  "bema_last_signout": 1609459200,
  "bema_google_id": "123456789012345678901",
  "bema_facebook_id": "1234567890123456",
  "bema_twitter_id": "123456789"
}
```

**Error Responses**:
- Missing Authorization Header (401)
- Invalid Authorization Header Format (401)
- Invalid Token (401)
- Expired Token (401)
- User Not Found (404)
- Update Failed (500)