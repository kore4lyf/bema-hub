# OTP Verification Endpoint

## Endpoint Details
- **URL**: `/wp-json/bema-hub/v1/auth/verify-otp`
- **Method**: `POST`
- **Authentication**: None (Public endpoint)
- **Permissions**: Users with valid OTP codes

## Description
This endpoint verifies the OTP code sent to a user's email or phone. It's used for email verification during signup, phone verification, and password reset. No authentication is required as it's used in all scenarios including for already authenticated users verifying phone numbers.

## Request Body
```json
{
  "email": "string",
  "otp_code": "string"
}
```

### Parameters
| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| email     | string | Yes      | The email of the user to verify      |
| otp_code  | string | Yes      | The 6-digit OTP code                 |

## Success Response

### Code: 200 OK
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

## Error Responses

### Missing Required Fields
**Code**: 400 Bad Request
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
**Code**: 400 Bad Request
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

### OTP Expired
**Code**: 400 Bad Request
```json
{
  "code": "otp_expired",
  "message": "OTP code has expired. Please request a new one.",
  "data": {
    "status": 400
  }
}
```

### Invalid OTP
**Code**: 400 Bad Request
```json
{
  "code": "invalid_otp",
  "message": "Invalid OTP code",
  "data": {
    "status": 400
  }
}
```

## Usage Examples

### cURL
```bash
curl -X POST \
  https://yoursite.com/wp-json/bema-hub/v1/auth/verify-otp \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "otp_code": "123456"
  }'
```

### JavaScript (Fetch API)
```javascript
// For email verification during signup
fetch('/wp-json/bema-hub/v1/auth/verify-otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    otp_code: '123456'
  }),
})
.then(response => response.json())
.then(data => {
  if (response.ok) {
    console.log('Email verified successfully');
    // Redirect to login page after email verification
    window.location.href = '/login';
  } else {
    console.error('OTP verification failed:', data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

## Implementation Details

This endpoint is implemented in the `Bema_Hub_REST_API` class in the `verify_otp` method. The process involves:

1. Validating that both email and otp_code are provided
2. Validating the email format
3. Retrieving the user by email address
4. Checking if the OTP code has expired (10-minute expiration)
5. Verifying the OTP code against the stored hash
6. Updating the appropriate verification status based on OTP purpose
7. Clearing the OTP data from user meta
8. Returning success response

## Security Considerations

1. All communication must use HTTPS encryption
2. OTP codes are hashed before storage
3. OTP codes have a 10-minute expiration time (increased from 5 minutes)
4. OTP codes are cleared after successful verification
5. Rate limiting should be implemented to prevent brute force attacks
6. Failed OTP attempts should be logged for security monitoring
7. No authentication is required as this endpoint is used in multiple scenarios

## Authentication Flow

This endpoint is used in multiple scenarios:
1. **Email verification during signup**: User verifies email after registration
2. **Phone verification**: Authenticated users verify phone numbers
3. **Password reset verification**: User verifies OTP during password reset

After email verification during signup, users are redirected to the login page to authenticate with their credentials.

## Related Endpoints
- [Signup](endpoint-auth-signup.md) - User registration that triggers OTP
- [Login](endpoint-auth-login.md) - Authentication after email verification