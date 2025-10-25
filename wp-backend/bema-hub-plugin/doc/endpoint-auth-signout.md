# Signout Endpoint Documentation

## Endpoint
```
POST /wp-json/bema-hub/v1/auth/signout
```

## Description
Signs out the currently authenticated user by invalidating their JWT token and logging the signout event. This endpoint adds the token to a blacklist to prevent further use.

## Authentication
Requires a valid JWT token in the Authorization header.

```
Authorization: Bearer <token>
```

## Request Body
This endpoint does not require a request body.

## Success Response

### Status Code
```
200 OK
```

### Response Body
```json
{
  "success": true,
  "message": "Successfully signed out"
}
```

## Error Responses

### Invalid or Missing Token
```
401 Unauthorized
```
```json
{
  "code": "missing_auth_header",
  "message": "Authorization header is required",
  "data": {
    "status": 401
  }
}
```

OR

```json
{
  "code": "invalid_auth_header",
  "message": "Invalid authorization header format",
  "data": {
    "status": 401
  }
}
```

OR

```json
{
  "code": "invalid_token",
  "message": "Invalid token signature",
  "data": {
    "status": 401
  }
}
```

### Expired Token
```
401 Unauthorized
```
```json
{
  "code": "token_expired",
  "message": "Token has expired",
  "data": {
    "status": 401
  }
}
```

### User Not Found
```
404 Not Found
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

## Implementation Details

### How Signout Works
This endpoint implements JWT token invalidation by adding the token to a blacklist:

1. Validates the JWT token in the Authorization header
2. Adds the token to an invalidated tokens list
3. Logs the signout event with user information
4. Logs token invalidation for security monitoring
5. Updates the user's `bema_last_signout` meta field with the current timestamp
6. Returns a success response

The invalidated tokens list is stored in the WordPress options table and checked during token validation. All signout and token validation events are logged for security monitoring.

### Client-Side Signout
For complete signout functionality, clients should:
1. Call this signout endpoint to log the event
2. Discard the JWT token from local storage/cookies
3. Redirect the user to the login page

### Security Considerations
- JWT tokens are invalidated server-side by adding them to a blacklist
- The blacklist is stored in the WordPress options table
- Tokens remain invalidated until their expiration time
- All signout and token validation events are logged for security monitoring
- Clients should clear tokens from all storage locations

## Example Usage

### JavaScript (using fetch)
```javascript
// Assuming you have the token stored
const token = localStorage.getItem('authToken');

fetch('https://yoursite.com/wp-json/bema-hub/v1/auth/signout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    // Clear token from storage
    localStorage.removeItem('authToken');
    // Redirect to login page
    window.location.href = '/login';
  }
})
.catch(error => {
  console.error('Signout error:', error);
});
```

### cURL
```bash
curl -X POST https://yoursite.com/wp-json/bema-hub/v1/auth/signout \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

## Related Endpoints
- [Signin](endpoint-auth-login.md)
- [Signup](endpoint-auth-signup.md)
- [Validate Token](endpoint-auth-validate.md)