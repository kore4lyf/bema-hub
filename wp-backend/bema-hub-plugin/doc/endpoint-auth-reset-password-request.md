# Reset Password Request Endpoint Documentation

## Endpoint
```
POST /wp-json/bema-hub/v1/auth/reset-password-request
```

## Description
Initiates the password reset process by sending a one-time password (OTP) code to the user's email address. This endpoint is used when a user has forgotten their password and needs to reset it.

## Request Body
```json
{
  "email": "string"
}
```

### Parameters
| Parameter | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| email     | string | Yes      | The user's email address  |

## Success Response

### Status Code
```
200 OK
```

### Response Body
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset code has been sent."
}
```

## Error Responses

### Missing Email
```
400 Bad Request
```
```json
{
  "code": "missing_email",
  "message": "Email is required",
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

## Implementation Details

### How Password Reset Request Works
This endpoint implements the first step of the password reset process:

1. Validates that an email address is provided and in a valid format
2. Checks if a user exists with the provided email address
3. For security reasons, returns the same response regardless of whether the email exists
4. If the user exists, generates a 6-digit OTP code
5. Hashes the OTP code using SHA256 before storing
6. Stores the hashed OTP and expiration time (10 minutes) in user meta fields
7. In a real implementation, sends the OTP code to the user's email
8. Logs the event for security monitoring

### Security Considerations
- Email enumeration prevention: The endpoint returns the same response whether the email exists or not
- OTP codes expire after 10 minutes (as per existing OTP specification)
- OTP codes are hashed using SHA256 before storage
- All password reset events are logged for security monitoring
- Rate limiting should be implemented to prevent abuse

## Example Usage

### JavaScript (using fetch)
```javascript
fetch('https://yoursite.com/wp-json/bema-hub/v1/auth/reset-password-request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com'
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log(data.message);
    // Proceed to OTP verification step
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

### cURL
```bash
curl -X POST https://yoursite.com/wp-json/bema-hub/v1/auth/reset-password-request \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

## Related Endpoints
- [Reset Password Verify](endpoint-auth-reset-password-verify.md)
- [Reset Password](endpoint-auth-reset-password.md)
- [Login](endpoint-auth-login.md)
- [Signup](endpoint-auth-signup.md)