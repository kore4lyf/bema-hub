# User Authentication Endpoint

## Endpoint Details
- **URL**: `/wp-json/bema-hub/v1/auth/signin`
- **Method**: `POST`
- **Authentication**: None (Public endpoint)
- **Permissions**: Authorized users with valid credentials

## Description
This endpoint authenticates users with their username or email address and password, then returns a JWT token for subsequent authorized requests.

## Request Body
```json
{
  "username": "string",
  "password": "string"
}
```

### Parameters
| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| username  | string | Yes      | Username or email address     |
| password  | string | Yes      | Account password                      |

## Success Response

### Code: 200 OK
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MTYxNjE2MTYsIm5iZiI6MTYxNjE2MTYxNiwiZXhwIjoxNjE2NzY2NDE2LCJkYXRhIjp7InVzZXJfaWQiOjEsInVzZXJfbG9naW4iOiJhZG1pbiIsInVzZXJfZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSJ9fQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "user_id": 1,
  "user_login": "admin",
  "user_email": "admin@example.com",
  "user_display_name": "Administrator"
}
```

## Error Responses

### Authentication Failed
**Code**: 401 Unauthorized
```json
{
  "code": "invalid_login",
  "message": "Authentication failed. Please check your credentials.",
  "data": {
    "status": 401
  }
}
```

### Missing Parameters
**Code**: 400 Bad Request
```json
{
  "code": "missing_credentials",
  "message": "Username and password are required",
  "data": {
    "status": 400
  }
}
```

### Invalid Parameter Types
**Code**: 400 Bad Request
```json
{
  "code": "invalid_parameters",
  "message": "Username and password must be strings",
  "data": {
    "status": 400
  }
}
```

## Usage Examples

### cURL
```bash
curl -X POST \
  https://yoursite.com/wp-json/bema-hub/v1/auth/signin \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### JavaScript (Fetch API)
```javascript
fetch('/wp-json/bema-hub/v1/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'password123'
  }),
})
.then(response => response.json())
.then(data => {
  if (response.ok) {
    // Store the authentication token for future API requests
    localStorage.setItem('authToken', data.token);
    console.log('Authentication successful');
  } else {
    console.error('Authentication failed:', data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

## Implementation Details

This endpoint is implemented in the `Bema_Hub_REST_API` class in the `login` method. The authentication process involves:

1. Validating that both username and password are provided
2. Validating that both parameters are strings
3. Sanitizing the username parameter
4. Authenticating the user using WordPress's `wp_authenticate` function
5. If authentication is successful, generating a JWT token with user information
6. Returning the token and user data in the response
7. Logging the authentication attempt (success or failure)

## Security Considerations

1. All communication must use HTTPS encryption
2. Passwords are never stored in logs or responses
3. Input validation ensures only string parameters are accepted
4. Username parameter is sanitized to prevent injection attacks
5. Rate limiting should be implemented to prevent brute force attacks
6. Tokens should be stored securely in the client application
7. Tokens expire after 7 days for enhanced security