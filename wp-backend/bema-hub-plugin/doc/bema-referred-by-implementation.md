# Bema Referred By Field Implementation

## Overview
This document describes the implementation of the `bema_referred_by` field in the Bema Hub API responses for authentication endpoints.

## Changes Made

### 1. JWT Authentication Class
Updated the `Bema_Hub_JWT_Auth` class to include the `bema_referred_by` field in the token payload:
- Added `bema_referred_by` field to the JWT token data in both `generate_token` and `authenticate_and_generate_token` methods
- The field is retrieved from user meta using `get_user_meta($user_id, 'bema_referred_by', true)`

### 2. Authentication Controller
Updated the Auth Controller to include `bema_referred_by` in API responses:
- **Signup endpoint**: Added `bema_referred_by` field to the response, showing the referral code set during signup
- **Social Login endpoint**: Added `bema_referred_by` field to the response, showing the referral code if set
- **Signin endpoint**: Now returns `bema_referred_by` as part of the JWT token data

### 3. User Controller
Updated the User Controller to include `bema_referred_by` in API responses:
- **Validate Token endpoint**: Added `bema_referred_by` field to the validation response data
- **Get Profile endpoint**: Added `bema_referred_by` field to the profile response (already included as part of all custom meta fields)

### 4. Documentation
Updated the endpoint reference documentation to reflect the new `bema_referred_by` field in:
- Signup endpoint response
- Signin endpoint response
- Social Login endpoint response
- Validate Token endpoint response
- Get Profile endpoint response

## Implementation Details

### Data Structure
The `bema_referred_by` field is returned as a string representing the referral code or user ID:
```json
{
  "bema_referred_by": "R-SOS2026-123"
}
```

### Endpoints Updated
1. **POST /wp-json/bema-hub/v1/auth/signup** - Returns `bema_referred_by` in response
2. **POST /wp-json/bema-hub/v1/auth/signin** - Returns `bema_referred_by` in JWT token data
3. **POST /wp-json/bema-hub/v1/auth/social-login** - Returns `bema_referred_by` in response
4. **POST /wp-json/bema-hub/v1/auth/validate** - Returns `bema_referred_by` in validation data
5. **GET /wp-json/bema-hub/v1/profile** - Returns `bema_referred_by` in profile data

### Field Restrictions
As per the project specification, the `bema_referred_by` field:
- Can only be set during user signup
- Cannot be updated through any other endpoint (including profile update)
- Is included in read operations (signin, signup, validate, profile)

## Usage Examples

### Signup Response
```json
{
  "success": true,
  "message": "Account created successfully. Please check your email for verification code.",
  "user_email": "user@example.com",
  "bema_email_verified": false,
  "bema_referred_by": "R-SOS2026-123",
  "role": "subscriber"
}
```

### Signin Response
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user_id": 123,
  "user_login": "user_example_com",
  "user_email": "user@example.com",
  "user_display_name": "John Doe",
  "first_name": "John",
  "last_name": "Doe",
  "avatar_url": "https://secure.gravatar.com/avatar/...",
  "bema_email_verified": true,
  "bema_referred_by": "R-SOS2026-123",
  "role": "subscriber"
}
```

### Validate Token Response
```json
{
  "valid": true,
  "data": {
    "user_id": 1,
    "user_login": "admin",
    "user_email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "avatar_url": "https://secure.gravatar.com/avatar/...",
    "bema_email_verified": true,
    "bema_referred_by": "R-SOS2026-123",
    "role": "administrator"
  }
}
```

### Profile Response
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "display_name": "Administrator",
  "first_name": "Admin",
  "last_name": "User",
  "avatar_url": "https://secure.gravatar.com/avatar/...",
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
  "bema_twitter_id": "123456789",
  "role": "administrator"
}
```