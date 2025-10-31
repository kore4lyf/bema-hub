# Endpoint Reference

This document provides a quick reference for all available endpoints in the Bema Hub plugin API.

## Authentication Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/wp-json/bema-hub/v1/auth/signin` | POST | Authenticate user and generate JWT token | No |
| `/wp-json/bema-hub/v1/auth/validate` | POST | Validate existing JWT token | Yes |
| `/wp-json/bema-hub/v1/auth/signup` | POST | Register new user account | No |
| `/wp-json/bema-hub/v1/auth/verify-otp` | POST | Verify OTP code for email verification or password reset | No |
| `/wp-json/bema-hub/v1/auth/social-login` | POST | Authenticate with Google, Facebook, or Twitter | No |
| `/wp-json/bema-hub/v1/auth/signout` | POST | Sign out currently authenticated user | Yes |
| `/wp-json/bema-hub/v1/auth/reset-password-request` | POST | Request password reset OTP code | No |
| `/wp-json/bema-hub/v1/auth/resend-otp` | POST | Resend OTP code for email verification or password reset | No |
| `/wp-json/bema-hub/v1/auth/verify-password-reset-otp` | POST | Verify password reset OTP code before allowing new password input | No |
| `/wp-json/bema-hub/v1/auth/reset-password` | POST | Reset user password with OTP code | No |

## Protected Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/wp-json/bema-hub/v1/profile` | GET | Retrieve authenticated user's profile information | Yes |
| `/wp-json/bema-hub/v1/profile` | PUT | Update authenticated user's profile information | Yes |

## Detailed Endpoint Information

### 1. Login
- **Endpoint**: `/wp-json/bema-hub/v1/auth/signin`
- **Method**: `POST`
- **Description**: Authenticate a user and generate a JWT token
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "username": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user_id": 123,
    "user_login": "johndoe",
    "user_email": "user@example.com",
    "user_display_name": "John Doe"
  }
  ```

### 2. Token Validation
- **Endpoint**: `/wp-json/bema-hub/v1/auth/validate`
- **Method**: `POST`
- **Description**: Validate an existing JWT token
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "Token is valid",
    "user_id": 123,
    "user_login": "johndoe",
    "user_email": "user@example.com",
    "user_display_name": "John Doe"
  }
  ```

### 3. Signup
- **Endpoint**: `/wp-json/bema-hub/v1/auth/signup`
- **Method**: `POST`
- **Description**: Register a new user account
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "first_name": "John",
    "last_name": "Doe",
    "country": "United States",
    "state": "New York"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "Signup successful. Please check your email for verification code.",
    "user_id": 123
  }
  ```

### 4. OTP Verification
- **Endpoint**: `/wp-json/bema-hub/v1/auth/verify-otp`
- **Method**: `POST`
- **Description**: Verify OTP code for email verification or password reset
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp_code": "123456"
  }
  ```
- **Success Response** (Email Verification):
  ```json
  {
    "success": true,
    "message": "Email verified successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user_id": 123,
    "user_login": "johndoe",
    "user_email": "user@example.com",
    "user_display_name": "John Doe"
  }
  ```
- **Success Response** (Password Reset):
  ```json
  {
    "success": true,
    "message": "Password reset code verified successfully",
    "reset_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 5. Social Login
- **Endpoint**: `/wp-json/bema-hub/v1/auth/social-login`
- **Method**: `POST`
- **Description**: Authenticate with Google, Facebook, or Twitter
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "provider": "google",
    "access_token": "ya29.a0AfH6SMC...",
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com",
    "country": "United States",
    "state": "New York"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user_id": 123,
    "user_login": "johndoe",
    "user_email": "user@example.com",
    "user_display_name": "John Doe",
    "is_new_user": true
  }
  ```

### 6. Signout
- **Endpoint**: `/wp-json/bema-hub/v1/auth/signout`
- **Method**: `POST`
- **Description**: Sign out the currently authenticated user
- **Auth Required**: Yes
- **Request Body**: None
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "Successfully signed out"
  }
  ```

### 7. Password Reset Request
- **Endpoint**: `/wp-json/bema-hub/v1/auth/reset-password-request`
- **Method**: `POST`
- **Description**: Request a password reset OTP code
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "If an account exists with this email, a password reset code has been sent."
  }
  ```

### 8. Resend OTP
- **Endpoint**: `/wp-json/bema-hub/v1/auth/resend-otp`
- **Method**: `POST`
- **Description**: Resend OTP code for email verification or password reset
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "A new password reset code has been sent to your email."
  }
  ```

### 9. Verify Password Reset OTP
- **Endpoint**: `/wp-json/bema-hub/v1/auth/verify-password-reset-otp`
- **Method**: `POST`
- **Description**: Verify password reset OTP code before allowing new password input
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp_code": "123456"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "OTP verified successfully. You can now enter your new password.",
    "user_id": 123
  }
  ```

### 10. Reset Password
- **Endpoint**: `/wp-json/bema-hub/v1/auth/reset-password`
- **Method**: `POST`
- **Description**: Reset user password with OTP code
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp_code": "123456",
    "new_password": "newSecurePassword123"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "Password reset successfully. You can now sign in with your new password."
  }
  ```

### 11. Get User Profile
- **Endpoint**: `/wp-json/bema-hub/v1/profile`
- **Method**: `GET`
- **Description**: Retrieve the authenticated user's profile information
- **Auth Required**: Yes
- **Request Body**: None
- **Success Response**:
  ```json
  {
    "success": true,
    "user_id": 123,
    "user_login": "johndoe",
    "user_email": "user@example.com",
    "user_display_name": "John Doe",
    "first_name": "John",
    "last_name": "Doe",
    "country": "United States",
    "state": "New York",
    "avatar_url": "https://secure.gravatar.com/avatar/..."
  }
  ```

### 12. Update User Profile
- **Endpoint**: `/wp-json/bema-hub/v1/profile`
- **Method**: `PUT`
- **Description**: Update the authenticated user's profile information
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Smith",
    "country": "United States",
    "state": "California"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "user_data": {
      "user_id": 123,
      "user_login": "johndoe",
      "user_email": "user@example.com",
      "user_display_name": "John Smith",
      "first_name": "John",
      "last_name": "Smith",
      "country": "United States",
      "state": "California",
      "avatar_url": "https://secure.gravatar.com/avatar/..."
    }
  }
  ```

## Common Error Responses

All endpoints may return the following error responses:

### Bad Request (400)
```json
{
  "code": "missing_fields",
  "message": "Required fields are missing",
  "data": {
    "status": 400
  }
}
```

### Unauthorized (401)
```json
{
  "code": "invalid_token",
  "message": "Invalid or expired token",
  "data": {
    "status": 401
  }
}
```

### Not Found (404)
```json
{
  "code": "user_not_found",
  "message": "User not found",
  "data": {
    "status": 404
  }
}
```

### Internal Server Error (500)
```json
{
  "code": "internal_error",
  "message": "An internal error occurred",
  "data": {
    "status": 500
  }
}
```