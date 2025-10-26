# Bema Hub Plugin API Documentation

This documentation provides detailed information about the REST API endpoints available in the Bema Hub plugin.

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Protected Endpoints](#protected-endpoints)
3. [Authentication Flow](#authentication-flow)
4. [Error Handling](#error-handling)
5. [Security Considerations](#security-considerations)
6. [Frontend Integration](#frontend-integration)
7. [Implementation Documentation](#implementation-documentation)

## Authentication Endpoints

These endpoints handle user authentication and token management.

### 1. Login
- **Endpoint**: `/wp-json/bema-hub/v1/auth/signin`
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

### 2. Update User Profile
- **Endpoint**: `/wp-json/bema-hub/v1/profile`
- **Method**: `PUT`
- **Description**: Update the authenticated user's profile information
- **Details**: [endpoint-profile-update.md](endpoint-profile-update.md)

## Authentication Flow

1. **User Registration** (Optional): New users register via the signup endpoint
2. **Email Verification** (Email signup only): Users verify their email with the OTP verification endpoint
3. **Redirect to Login**: After email verification, users are redirected to login
4. **User Login**: Client sends username/email and password to the login endpoint
5. **Token Generation**: Server validates credentials and returns a JWT token
6. **Token Storage**: Client stores the token securely (e.g., in localStorage or HttpOnly cookies)
7. **Authenticated Requests**: Client includes the token in the Authorization header for subsequent requests
8. **Token Validation**: Server validates the token before processing protected endpoint requests
9. **User Signout**: Client can sign out by calling the signout endpoint and clearing the token
10. **Password Reset**: Users can reset forgotten passwords using the password reset flow
11. **Token Refresh**: When token expires, client must re-authenticate

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
  body: JSON.stringify({ 
    email: 'user@example.com', 
    otp_code: '123456' 
  })
});

const verifyData = await verifyResponse.json();
if (verifyData.success) {
  // Redirect to login after email verification
  window.location.href = '/login';
}

// 3. Login (after verification or for existing users)
const loginResponse = await fetch('/wp-json/bema-hub/v1/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    username: 'user@example.com', 
    password: 'securepassword' 
  })
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
console.log('User avatar URL:', profileData.avatar_url);

// 6. Update profile
const updateResponse = await fetch('/wp-json/bema-hub/v1/profile', {
  method: 'PUT',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    first_name: 'John',
    last_name: 'Smith',
    bema_state: 'California'
  })
});

// 7. Sign out
const signoutResponse = await fetch('/wp-json/bema-hub/v1/auth/signout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

const signoutData = await signoutResponse.json();
// Clear token from storage
localStorage.removeItem('authToken');
```

## Password Reset Flow

1. **Request Reset**: User requests password reset with email
2. **Verify OTP**: User verifies OTP code sent to email
3. **Set New Password**: User sets new password (no reset token needed)
4. **Login**: User logs in with new password

### Example Password Reset Flow
```javascript
// 1. Request password reset
const resetRequestResponse = await fetch('/wp-json/bema-hub/v1/auth/reset-password-request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
});

// 2. Verify reset OTP
const verifyResetResponse = await fetch('/wp-json/bema-hub/v1/auth/reset-password-verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'user@example.com', 
    otp_code: '123456' 
  })
});

// 3. Set new password
const resetPasswordResponse = await fetch('/wp-json/bema-hub/v1/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'user@example.com',
    otp_code: '123456',
    new_password: 'newSecurePassword123'
  })
});

// 4. Redirect to login
window.location.href = '/login';
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
12. **Password Reset**: Password reset uses OTP verification without reset tokens
13. **Shared OTP Fields**: Single OTP field reused for all verification purposes (email, phone, password reset)
14. **Modular Architecture**: Controllers separated by functionality for better maintainability
15. **Logging**: All authentication events are logged for security monitoring
16. **Audit Trail**: Comprehensive logging provides an audit trail for all authentication events
17. **Token Persistence**: Invalidated tokens are persisted across requests for proper security

## Frontend Integration

The Bema Hub plugin API endpoints are designed to work seamlessly with modern frontend frameworks using Redux Toolkit RTK Query with `fetchBaseQuery`.

### Redux RTK Query Implementation

The frontend uses a modern Redux pattern with clear separation of concerns:
1. **Auth Slice**: Manages local application state (user, token, flags)
2. **API Slices**: Handle all server communication and caching
3. **No Manual Async Logic**: RTK Query manages all async operations automatically

### Benefits
- **Automatic Caching**: Data is cached efficiently with configurable expiration
- **Optimistic Updates**: Mutations can update cache immediately with rollback on failure
- **Loading States**: Automatic loading states per query/mutation
- **Request Deduplication**: Multiple components using the same query share one request
- **Background Updates**: RTK Query can refetch data in background when needed

For detailed implementation examples, see:
- [frontend-integration-guide.md](frontend-integration-guide.md) - Complete integration guide
- [redux-rtk-query-implementation.md](redux-rtk-query-implementation.md) - Specific RTK Query implementation details
- [rtk-query-frontend-patterns.md](rtk-query-frontend-patterns.md) - Detailed patterns for your specific implementation

## Implementation Documentation

Comprehensive documentation about the plugin implementation:

- [implementation-summary.md](implementation-summary.md) - Overall implementation summary
- [final-implementation-summary.md](final-implementation-summary.md) - Final implementation overview
- [architecture-improvements-summary.md](architecture-improvements-summary.md) - Architecture improvements
- [logger-implementation-summary.md](logger-implementation-summary.md) - Logger implementation details
- [user-meta-fields.md](user-meta-fields.md) - Complete reference of user meta fields
- [city-to-state-changes-summary.md](city-to-state-changes-summary.md) - Changes from city to state
- [endpoint-reference.md](endpoint-reference.md) - Quick reference for all endpoints with sample requests and responses

### Endpoint Documentation
- [endpoint-auth-login.md](endpoint-auth-login.md) - Login endpoint
- [endpoint-auth-validate.md](endpoint-auth-validate.md) - Token validation endpoint
- [endpoint-auth-signup.md](endpoint-auth-signup.md) - Signup endpoint
- [endpoint-auth-verify-otp.md](endpoint-auth-verify-otp.md) - OTP verification endpoint
- [endpoint-auth-social-login.md](endpoint-auth-social-login.md) - Social login endpoint
- [endpoint-auth-signout.md](endpoint-auth-signout.md) - Signout endpoint
- [endpoint-auth-reset-password-request.md](endpoint-auth-reset-password-request.md) - Password reset request endpoint
- [endpoint-auth-reset-password-verify.md](endpoint-auth-reset-password-verify.md) - Password reset verification endpoint
- [endpoint-auth-reset-password.md](endpoint-auth-reset-password.md) - Password reset endpoint
- [endpoint-profile.md](endpoint-profile.md) - Get user profile endpoint
- [endpoint-profile-update.md](endpoint-profile-update.md) - Update user profile endpoint

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