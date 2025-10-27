# WordPress Roles Implementation

## Overview
This document describes the implementation of WordPress user roles in the Bema Hub API responses for authentication endpoints.

## Changes Made

### 1. JWT Authentication Class
Updated the `Bema_Hub_JWT_Auth` class to include user role in the token payload:
- Added `role` field to the JWT token data (not `roles` as WordPress users have one primary role)
- Included user role in both `generate_token` and `authenticate_and_generate_token` methods
- Role is retrieved from the WordPress user object using `reset($user->roles)` to get the primary role

### 2. Authentication Controller
Updated the Auth Controller to include role in API responses:
- **Signup endpoint**: Added `role` field to the response, showing the user's WordPress role
- **Social Login endpoint**: Added `role` field to the response, showing the user's WordPress role
- **Signin endpoint**: Now returns role as part of the JWT token data

### 3. User Controller
Updated the User Controller to include role in API responses:
- **Validate Token endpoint**: Added `role` field to the validation response data
- **Get Profile endpoint**: Added `role` field to the profile response
- **Update Profile endpoint**: Specified that role cannot be updated (immutable field)

### 4. Documentation
Updated the endpoint reference documentation to reflect the new `role` field in:
- Signup endpoint response
- Signin endpoint response
- Social Login endpoint response
- Validate Token endpoint response
- Get Profile endpoint response
- Update Profile endpoint documentation (noting role is immutable)

## Implementation Details

### Data Structure
The role field is returned as a string representing the WordPress role assigned to the user:
```json
{
  "role": "subscriber"
}
```

or for administrators:
```json
{
  "role": "administrator"
}
```

### Endpoints Updated
1. **POST /wp-json/bema-hub/v1/auth/signup** - Returns role in response
2. **POST /wp-json/bema-hub/v1/auth/signin** - Returns role in JWT token data
3. **POST /wp-json/bema-hub/v1/auth/social-login** - Returns role in response
4. **POST /wp-json/bema-hub/v1/auth/validate** - Returns role in validation data
5. **GET /wp-json/bema-hub/v1/profile** - Returns role in profile data
6. **PUT /wp-json/bema-hub/v1/profile** - Documentation updated to note role is immutable

### Security Considerations
- Role is only included in responses for authenticated users or when validating tokens
- The role field is not updateable through the profile update endpoint
- Role is retrieved directly from WordPress user objects, ensuring accuracy

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