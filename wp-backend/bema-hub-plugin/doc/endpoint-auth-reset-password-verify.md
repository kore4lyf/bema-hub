# Reset Password Verify Endpoint Documentation

## Endpoint
```
POST /wp-json/bema-hub/v1/auth/reset-password-verify
```

## Description
Verifies the one-time password (OTP) code sent to the user's email during the password reset process. No authentication is required. After successful verification, user should proceed to set a new password.

## Request Body
```json
{
  "email": "string",
  "otp_code": "string"
}
```

### Parameters
| Parameter | Type   | Required | Description                   |
|-----------|--------|----------|-------------------------------|
| email     | string | Yes      | The user's email address      |
| otp_code  | string | Yes      | The 6-digit OTP code received |

## Success Response

### Status Code
```
200 OK
```

### Response Body
```json
{
  "success": true,
  "message": "Password reset code verified successfully"
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
  "message": "Email and OTP code are required",
  "data": {
    "status": 400
  }
}
```

### Invalid Email Format
```
400 Bad Request
```
```json
{
  "code": "invalid_email",
  "message": "Please provide a valid email address",
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

### No OTP Found
```
400 Bad Request
```
```json
{
  "code": "no_otp",
  "message": "No password reset code found. Please request a new one.",
  "data": {
    "status": 400
  }
}
```

### Expired OTP
```
400 Bad Request
```
```json
{
  "code": "otp_expired",
  "message": "Password reset code has expired. Please request a new one.",
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
  "message": "Invalid password reset code",
  "data": {
    "status": 400
  }
}
```

## Implementation Details

### How Password Reset Verification Works
This endpoint implements the second step of the password reset process:

1. Validates that both email and OTP code are provided
2. Validates the email format
3. Retrieves the user by email
4. Gets the stored hashed OTP and expiration time from user meta
5. Checks if an OTP exists for this user with purpose "password_reset"
6. Checks if the OTP has expired (10-minute window)
7. Verifies the provided OTP code against the stored hash using timing-safe comparison
8. Clears the OTP data from user meta after successful verification
9. Returns success response
10. Logs all events for security monitoring

### Security Considerations
- OTP codes are verified using timing-safe comparison to prevent timing attacks
- OTP codes expire after 10 minutes (as per existing OTP specification)
- All verification attempts are logged for security monitoring
- Failed attempts should be rate limited to prevent brute force attacks
- No authentication is required as this is part of the password reset flow

## Example Usage

### JavaScript (using fetch)
```javascript
fetch('https://yoursite.com/wp-json/bema-hub/v1/auth/reset-password-verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    otp_code: '123456'
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log(data.message);
    // Proceed to password reset step
    window.location.href = '/reset-password';
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

### cURL
```bash
curl -X POST https://yoursite.com/wp-json/bema-hub/v1/auth/reset-password-verify \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp_code": "123456"}'
```

## Related Endpoints
- [Reset Password Request](endpoint-auth-reset-password-request.md)
- [Reset Password](endpoint-auth-reset-password.md)
- [Login](endpoint-auth-login.md)