# Resend OTP Endpoint

## Endpoint
`POST /wp-json/bema-hub/v1/auth/resend-otp`

## Description
Resend a new OTP code to the user's email address when the previous OTP has expired or been lost. This endpoint can be used for both email verification during signup and password reset scenarios.

## Request Body
```json
{
  "email": "user@example.com"
}
```

### Parameters

| Parameter | Type   | Required | Description                     |
|-----------|--------|----------|---------------------------------|
| email     | String | Yes      | The user's email address        |

## Success Response (200)
```json
{
  "success": true,
  "message": "A new verification code has been sent to your email."
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

### No Active OTP
```
400 Bad Request
```
```json
{
  "code": "no_active_otp",
  "message": "No active OTP found for this user. Please initiate the appropriate process first.",
  "data": {
    "status": 400
  }
}
```

## Usage Examples

### cURL
```bash
curl -X POST \
  https://yoursite.com/wp-json/bema-hub/v1/auth/resend-otp \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com"
  }'
```

### JavaScript (Fetch API)
```javascript
// For resending OTP when previous one expired
fetch('/wp-json/bema-hub/v1/auth/resend-otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com'
  }),
})
.then(response => response.json())
.then(data => {
  if (response.ok) {
    console.log('New OTP sent successfully');
  } else {
    console.error('Failed to resend OTP:', data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

## Implementation Details

### How Resend OTP Works
This endpoint allows users to request a new OTP code when their previous one has expired or been lost:

1. Validates that an email address is provided and in a valid format
2. Retrieves the user by email address
3. Checks if the user has an active OTP or is in the email verification process
4. Generates a new 6-digit OTP code
5. Hashes the OTP code using SHA256 before storing
6. Stores the hashed OTP and expiration time (10 minutes) in user meta fields
7. Maintains the same OTP purpose (email verification or password reset)
8. In a real implementation, sends the OTP code to the user's email
9. Logs the event for security monitoring
10. Returns success response with appropriate message

### Security Considerations
- Email enumeration prevention: Returns appropriate error messages for non-existent users
- OTP codes expire after 10 minutes (as per existing OTP specification)
- OTP codes are hashed using SHA256 before storage
- All resend OTP events are logged for security monitoring
- Rate limiting should be implemented to prevent abuse
- No authentication is required as this is used in pre-authentication scenarios

## Technical Details

### OTP Generation
- **Code Format**: 6-digit random number
- **Expiration**: 10 minutes from generation time
- **Storage**: SHA256 hashed before storage in `bema_otp_code` user meta field
- **Purpose Tracking**: Maintains the same purpose as the previous OTP (`email_verification` or `password_reset`)

### Response Messages
The endpoint returns different messages based on the OTP purpose:
- For email verification: "A new email verification code has been sent to your email."
- For password reset: "A new password reset code has been sent to your email."
- For other cases: "A new verification code has been sent to your email."

### User State Detection
The endpoint automatically detects the user's current state:
1. If user has an active OTP, it maintains the same purpose
2. If user has no active OTP but email is not verified, it assumes email verification purpose
3. If user has no active OTP and email is already verified, it returns an error

This ensures the correct type of OTP is sent based on the user's current authentication flow.