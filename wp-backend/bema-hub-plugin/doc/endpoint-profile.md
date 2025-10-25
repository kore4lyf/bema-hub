# User Profile Endpoint

## Endpoint Details
- **URL**: `/wp-json/bema-hub/v1/profile`
- **Method**: `GET`
- **Authentication**: Required (Bearer Token)
- **Permissions**: Authenticated users

## Description
This endpoint returns the profile information of the authenticated user. It serves as an example of a protected endpoint that requires a valid JWT token.

## Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### Parameters
| Header        | Value                     | Required | Description                          |
|---------------|---------------------------|----------|--------------------------------------|
| Authorization | Bearer {JWT_TOKEN}        | Yes      | Valid JWT token                      |

## Success Response

### Code: 200 OK
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "display_name": "Administrator",
  "first_name": "Admin",
  "last_name": "User"
}
```

## Error Responses

### Missing Authorization Header
**Code**: 401 Unauthorized
```json
{
  "code": "missing_auth_header",
  "message": "Authorization header is required",
  "data": {
    "status": 401
  }
}
```

### Invalid Authorization Header Format
**Code**: 401 Unauthorized
```json
{
  "code": "invalid_auth_header",
  "message": "Invalid authorization header format",
  "data": {
    "status": 401
  }
}
```

### Invalid Token
**Code**: 401 Unauthorized
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
**Code**: 401 Unauthorized
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
**Code**: 404 Not Found
```json
{
  "code": "user_not_found",
  "message": "User not found",
  "data": {
    "status": 404
  }
}
```

## Usage Examples

### cURL
```bash
curl -X GET \
  https://yoursite.com/wp-json/bema-hub/v1/profile \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
```

### JavaScript (Fetch API)
```javascript
const token = localStorage.getItem('authToken');

fetch('/wp-json/bema-hub/v1/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
.then(response => response.json())
.then(data => {
  if (response.ok) {
    console.log('Profile data:', data);
  } else {
    if (data.code === 'token_expired' || data.code === 'invalid_token') {
      // Token is invalid, redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    console.error('Profile request failed:', data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

## Implementation Details

This endpoint is implemented in the `Bema_Hub_REST_API` class in the `get_profile` method. The process involves:

1. Extracting the token from the Authorization header
2. Validating the token using the JWT authentication system
3. If the token is valid, extracting the user ID from the token payload
4. Retrieving the user's profile information from WordPress
5. Returning the user's profile data in the response

The endpoint uses a permission callback (`validate_jwt_permission`) to validate the token before processing the request.

## Security Considerations

1. All communication should happen over HTTPS
2. Tokens must be validated before accessing user data
3. User data should only be accessible to the authenticated user
4. Rate limiting should be implemented to prevent abuse
5. Sensitive user information should not be exposed through this endpoint