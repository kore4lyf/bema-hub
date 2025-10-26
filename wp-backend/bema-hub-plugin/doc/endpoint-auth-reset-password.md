# Reset Password Endpoint Documentation

## Endpoint
```
POST /wp-json/bema-hub/v1/auth/reset-password
```

## Description
Sets a new password for the user after successful OTP verification. User must then login with the new password. No reset token is used - verification is done through OTP validation.

## Request Body
```json
{
  "email": "string",
  "otp_code": "string",
  "new_password": "string"
}
```

### Parameters
| Parameter    | Type   | Required | Description                               |
|--------------|--------|----------|-------------------------------------------|
| email        | string | Yes      | The user's email address                  |
| otp_code     | string | Yes      | The OTP code for verification             |
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
  "message": "Password has been reset successfully. Please login with your new password."
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
  "message": "Email, OTP code, and new password are required",
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

### Invalid OTP
```
400 Bad Request
```
```json
{
  "code": "invalid_otp",
  "message": "Invalid or expired OTP code",
  "data": {
    "status": 400
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

1. Validates that email, OTP code, and new password are provided
2. Validates password strength (minimum 8 characters)
3. Verifies the OTP code one final time for security
4. Retrieves the user associated with the email
5. Updates the user's password using WordPress's wp_set_password function
6. Clears any temporary reset data
7. Logs the event for security monitoring
8. Returns success response directing user to login

### Security Considerations
- Passwords must be at least 8 characters long
- OTP codes are verified again for security
- Passwords are hashed using WordPress's secure password hashing
- All password reset events are logged for security monitoring
- Rate limiting should be implemented to prevent abuse

## Example Usage

### JavaScript (using fetch)
```javascript
fetch('https://yoursite.com/wp-json/bema-hub/v1/auth/reset-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    otp_code: '123456',
    new_password: 'newSecurePassword123'
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log(data.message);
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
  -d '{"email": "user@example.com", "otp_code": "123456", "new_password": "newSecurePassword123"}'
```

## Related Endpoints
- [Reset Password Request](endpoint-auth-reset-password-request.md)
- [Reset Password Verify](endpoint-auth-reset-password-verify.md)
- [Login](endpoint-auth-login.md)