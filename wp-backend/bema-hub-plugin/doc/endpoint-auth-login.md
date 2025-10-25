# Authentication Login Endpoint

## Endpoint Details
- **URL**: `/wp-json/bema-hub/v1/auth/login`
- **Method**: `POST`
- **Authentication**: None (Public endpoint)
- **Permissions**: Any user with valid credentials

## Description
This endpoint authenticates a user with their username/email and password, and returns a JWT token that can be used for subsequent authenticated requests.

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
| username  | string | Yes      | User's username or email address     |
| password  | string | Yes      | User's password                      |

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

### Invalid Credentials
**Code**: 401 Unauthorized
```json
{
  "code": "invalid_login",
  "message": "Invalid username or password",
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

## Usage Examples

### cURL
```bash
curl -X POST \
  https://yoursite.com/wp-json/bema-hub/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### JavaScript (Fetch API)
```javascript
fetch('/wp-json/bema-hub/v1/auth/login', {
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
    // Store the token for future requests
    localStorage.setItem('authToken', data.token);
    console.log('Login successful');
  } else {
    console.error('Login failed:', data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

## Implementation Details

This endpoint is implemented in the `Bema_Hub_REST_API` class in the `login` method. The process involves:

1. Validating that both username and password are provided
2. Authenticating the user using WordPress's `wp_authenticate` function
3. If authentication is successful, generating a JWT token with user information
4. Returning the token and user data in the response
5. Logging the authentication attempt (success or failure)

## Security Considerations

1. All communication should happen over HTTPS
2. Passwords are never stored in logs or responses
3. Rate limiting should be implemented to prevent brute force attacks
4. Tokens should be stored securely in the client application
5. Tokens expire after 7 days for security