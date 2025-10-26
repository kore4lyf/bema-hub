# Reset Password Endpoint Documentation

## Endpoint
```
POST /wp-json/bema-hub/v1/auth/reset-password
```

## Description
Sets a new password for the user after successful OTP verification. This endpoint requires a valid reset token obtained from the reset password verification step.

## Request Body
```json
{
  "reset_token": "string",
  "new_password": "string"
}
```

### Parameters
| Parameter    | Type   | Required | Description                               |
|--------------|--------|----------|-------------------------------------------|
| reset_token  | string | Yes      | The temporary reset token from verification |
| new_password | string | Yes      | The new password (minimum 8 characters)   |

## Success Response

### Status Code
```
200 OK
```

### Response Body
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

## Error Responses

### Missing Fields
```
400 Bad Request
```
```json
{
  "code": "missing_fields",
  "message": "Reset token and new password are required",
  "data": {
    "status": 400
  }
}
```

### Weak Password
```
400 Bad Request
```
```json
{
  "code": "weak_password",
  "message": "Password must be at least 8 characters long",
  "data": {
    "status": 400
  }
}
```

### Invalid Token
```
400 Bad Request
```
```json
{
  "code": "invalid_token",
  "message": "Invalid reset token",
  "data": {
    "status": 400
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

### How Password Reset Works
This endpoint implements the final step of the password reset process:

1. Validates that both reset_token and new_password are provided
2. Validates password strength (minimum 8 characters)
3. Validates the reset token using the JWT authentication system
4. Checks that the token is specifically for password reset purposes
5. Retrieves the user associated with the token
6. Updates the user's password using WordPress's wp_set_password function
7. Clears any temporary reset data
8. Logs the event for security monitoring
9. Returns success response

### Security Considerations
- Passwords must be at least 8 characters long
- Reset tokens are purpose-specific and time-limited (1 hour)
- Passwords are hashed using WordPress's secure password hashing
- All password reset events are logged for security monitoring
- Tokens are invalidated after use
- Rate limiting should be implemented to prevent abuse

## Example Usage

### JavaScript (using fetch)
```javascript
const resetToken = localStorage.getItem('resetToken');

fetch('https://yoursite.com/wp-json/bema-hub/v1/auth/reset-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reset_token: resetToken,
    new_password: 'newSecurePassword123'
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log(data.message);
    // Clear the reset token
    localStorage.removeItem('resetToken');
    // Redirect to login page
    window.location.href = '/login';
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

### cURL
```bash
curl -X POST https://yoursite.com/wp-json/bema-hub/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"reset_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...", "new_password": "newSecurePassword123"}'
```

## Related Endpoints
- [Reset Password Request](endpoint-auth-reset-password-request.md)
- [Reset Password Verify](endpoint-auth-reset-password-verify.md)
- [Login](endpoint-auth-login.md)