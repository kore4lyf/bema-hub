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

## Protected Endpoints

These endpoints require a valid JWT token in the Authorization header.

### 1. User Profile
- **Endpoint**: `/wp-json/bema-hub/v1/profile`
- **Method**: `GET`
- **Description**: Retrieve the authenticated user's profile information
- **Details**: [endpoint-profile.md](endpoint-profile.md)

## Authentication Flow

1. **User Login**: Client sends username/email and password to the login endpoint
2. **Token Generation**: Server validates credentials and returns a JWT token
3. **Token Storage**: Client stores the token securely (e.g., in localStorage or HttpOnly cookies)
4. **Authenticated Requests**: Client includes the token in the Authorization header for subsequent requests
5. **Token Validation**: Server validates the token before processing protected endpoint requests
6. **Token Refresh**: When token expires, client must re-authenticate

### Example Flow
```javascript
// 1. Login
const loginResponse = await fetch('/wp-json/bema-hub/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'user', password: 'pass' })
});

const loginData = await loginResponse.json();
const token = loginData.token;

// 2. Store token
localStorage.setItem('authToken', token);

// 3. Make authenticated request
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

## Implementation Notes

The API is built using WordPress REST API standards and follows best practices for security and performance. All endpoints are registered during the `rest_api_init` hook and are automatically available when the plugin is activated.