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
- **Description**: Verify email with OTP code
- **Details**: [endpoint-auth-verify-otp.md](endpoint-auth-verify-otp.md)

### 5. Social Login
- **Endpoint**: `/wp-json/bema-hub/v1/auth/social-login`
- **Method**: `POST`
- **Description**: Authenticate with Google, Facebook, or Twitter
- **Details**: [endpoint-auth-social-login.md](endpoint-auth-social-login.md)

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
8. **Token Refresh**: When token expires, client must re-authenticate

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
    country: 'United States'
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
8. **OTP Security**: OTP codes expire after 5 minutes and are hashed before storage
9. **Data Encryption**: Sensitive data like phone numbers are encrypted before storage
10. **Social Login**: Social login users are automatically verified

## Implementation Notes

The API is built using WordPress REST API standards and follows best practices for security and performance. All endpoints are registered during the `rest_api_init` hook and are automatically available when the plugin is activated.