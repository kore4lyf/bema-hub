# Bema Hub Plugin API Documentation

This documentation provides detailed information about the REST API endpoints available in the Bema Hub plugin.

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Protected Endpoints](#protected-endpoints)
3. [Authentication Flow](#authentication-flow)
4. [Error Handling](#error-handling)
5. [Security Considerations](#security-considerations)

## Authentication Endpoints

These endpoints handle user authentication and token management.

### 1. Login
- **Endpoint**: `/wp-json/bema-hub/v1/auth/login`
- **Method**: `POST`
- **Description**: Authenticate a user and generate a JWT token
- **Details**: [endpoint-auth-login.md](endpoint-auth-login.md)

### 2. Token Validation
- **Endpoint**: `/wp-json/bema-hub/v1/auth/validate`
- **Method**: `POST`
- **Description**: Validate an existing JWT token
- **Details**: [endpoint-auth-validate.md](endpoint-auth-validate.md)

### 3. Signup
- **Endpoint**: `/wp-json/bema-hub/v1/auth/signup`
- **Method**: `POST`
- **Description**: Register a new user account
- **Details**: [endpoint-auth-signup.md](endpoint-auth-signup.md)

### 4. OTP Verification
- **Endpoint**: `/wp-json/bema-hub/v1/auth/verify-otp`
- **Method**: `POST`
- **Description**: Verify OTP code for email verification or password reset
- **Details**: [endpoint-auth-verify-otp.md](endpoint-auth-verify-otp.md)

### 5. Social Login
- **Endpoint**: `/wp-json/bema-hub/v1/auth/social-login`
- **Method**: `POST`
- **Description**: Authenticate with Google, Facebook, or Twitter
- **Details**: [endpoint-auth-social-login.md](endpoint-auth-social-login.md)

### 6. Signout
- **Endpoint**: `/wp-json/bema-hub/v1/auth/signout`
- **Method**: `POST`
- **Description**: Sign out the currently authenticated user
- **Details**: [endpoint-auth-signout.md](endpoint-auth-signout.md)

### 7. Password Reset Request
- **Endpoint**: `/wp-json/bema-hub/v1/auth/reset-password-request`
- **Method**: `POST`
- **Description**: Request a password reset OTP code
- **Details**: [endpoint-auth-reset-password-request.md](endpoint-auth-reset-password-request.md)

## Protected Endpoints

These endpoints require a valid JWT token in the Authorization header.

### 1. User Profile
- **Endpoint**: `/wp-json/bema-hub/v1/profile`
- **Method**: `GET`
- **Description**: Retrieve the authenticated user's profile information
- **Details**: [endpoint-profile.md](endpoint-profile.md)

## Authentication Flow

1. **User Registration** (Optional): New users register via the signup endpoint
2. **Email Verification** (Email signup only): Users verify their email with the OTP verification endpoint
3. **User Login**: Client sends username/email and password to the login endpoint
4. **Token Generation**: Server validates credentials and returns a JWT token
5. **Token Storage**: Client stores the token securely (e.g., in localStorage or HttpOnly cookies)
6. **Authenticated Requests**: Client includes the token in the Authorization header for subsequent requests
7. **Token Validation**: Server validates the token before processing protected endpoint requests
8. **User Signout**: Client can sign out by calling the signout endpoint and clearing the token
9. **Password Reset**: Users can reset forgotten passwords using the password reset flow
10. **Token Refresh**: When token expires, client must re-authenticate

### Example Flow
```javascript
// 1. Signup (if new user)
const signupResponse = await fetch('/wp-json/bema-hub/v1/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'user@example.com',
    password: 'securepassword',
    first_name: 'John',
    last_name: 'Doe',
    country: 'United States',
    state: 'New York'
  })
});

// 2. Verify OTP (email signup only)
const verifyResponse = await fetch('/wp-json/bema-hub/v1/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: 123, otp_code: '123456' })
});

const verifyData = await verifyResponse.json();
const token = verifyData.token;

// 3. Login (existing users)
const loginResponse = await fetch('/wp-json/bema-hub/v1/auth/sigin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'user', password: 'pass' })
});

const loginData = await loginResponse.json();
const token = loginData.token;

// 4. Store token
localStorage.setItem('authToken', token);

// 5. Make authenticated request
const profileResponse = await fetch('/wp-json/bema-hub/v1/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const profileData = await profileResponse.json();

// 6. Sign out
const signoutResponse = await fetch('/wp-json/bema-hub/v1/auth/signout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

const signoutData = await signoutResponse.json();
// Clear token from storage
localStorage.removeItem('authToken');
```

## Error Handling

All endpoints return appropriate HTTP status codes and JSON error responses:

### Common Status Codes
- **200**: Success
- **400**: Bad Request (missing or invalid parameters)
- **401**: Unauthorized (invalid or missing authentication)
- **404**: Not Found (resource not found)
- **500**: Internal Server Error (server-side issues)

### Error Response Format
```json
{
  "code": "error_code",
  "message": "Human readable error message",
  "data": {
    "status": 401
  }
}
```

## Security Considerations

1. **HTTPS Only**: All API communication should happen over HTTPS
2. **Token Storage**: Store tokens securely in the client application
3. **Token Expiration**: Tokens expire after 7 days for security
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Input Validation**: All input is validated and sanitized
6. **Strong Secrets**: Use a strong, unique `JWT_SECRET` in wp-config.php
7. **Error Information**: Error messages do not expose sensitive information
8. **OTP Security**: OTP codes expire after 10 minutes and are SHA256 hashed before storage
9. **Data Encryption**: Sensitive data like phone numbers are encrypted before storage
10. **Social Login**: Social login users are automatically verified
11. **Signout**: Users can sign out to terminate their session with token invalidation
12. **Password Reset**: Password reset uses OTP verification and temporary tokens
13. **Shared OTP Fields**: Single OTP field reused for all verification purposes (email, phone, password reset)
14. **Modular Architecture**: Controllers separated by functionality for better maintainability
15. **Logging**: All authentication events are logged for security monitoring
16. **Audit Trail**: Comprehensive logging provides an audit trail for all authentication events
17. **Token Persistence**: Invalidated tokens are persisted across requests for proper security

## Implementation Notes

The API is built using WordPress REST API standards and follows best practices for security and performance. All endpoints are registered during the `rest_api_init` hook and are automatically available when the plugin is activated.

### Architecture

The system follows a modular controller-based architecture:
- **Auth Controller**: Handles authentication endpoints (login, signup, social login)
- **OTP Controller**: Manages OTP-related functionality (verification, password reset)
- **User Controller**: Manages user operations (profile, signout, token validation)
- **Main REST API Class**: Registers routes and coordinates controllers

### Token Invalidation

The system implements proper token invalidation:
- When a user signs out, their token is added to an invalidated tokens list
- This list is persisted to the WordPress options table
- On subsequent requests, invalidated tokens are rejected
- The persistence mechanism ensures security across page loads

### Logger Implementation

The Bema Hub plugin uses a comprehensive logging system for security monitoring:

- **Bema_Hub_Logger**: Custom logging class that stores logs securely in the WordPress uploads directory
- **Log Levels**: All authentication events are logged with appropriate levels (INFO, WARNING, ERROR)
- **Security Events**: Signout events, token validation attempts, OTP verification, and authentication attempts are all logged
- **Sensitive Data Protection**: Full tokens and OTP codes are never logged, only previews
- **Automatic Cleanup**: Logs are automatically cleaned up after 30 days
- **Performance Monitoring**: Performance timing is available for critical operations

For detailed information about the logger implementation, see [logger-implementation-summary.md](logger-implementation-summary.md).