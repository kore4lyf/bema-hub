# Signup Endpoint

## Endpoint
`POST /wp-json/bema-hub/v1/auth/signup`

## Description
Register a new user account with email verification. This endpoint creates a new user in the WordPress system and sends an OTP code for email verification.

## Request Body
```json
{
  "email": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string",
  "phone_number": "string",
  "country": "string",
  "state": "string",
  "referred_by": "string"
}
```

## Parameters

| Parameter     | Type   | Required | Description                          |
|---------------|--------|----------|--------------------------------------|
| email         | string | Yes      | User's email address                 |
| password      | string | Yes      | User's password                      |
| first_name    | string | Yes      | User's first name                    |
| last_name     | string | Yes      | User's last name                     |
| phone_number  | string | No       | User's phone number                  |
| country       | string | Yes      | User's country                       |
| state         | string | No       | User's state                         |
| referred_by   | string | No       | Referral code or user ID             |

## Response Format

### Success Response (200)
```json
{
  "success": true,
  "message": "Account created successfully. Please check your email for verification code.",
  "user_email": "user@example.com"
}
```

### Error Responses

#### Missing Required Fields (400)
```json
{
  "code": "missing_fields",
  "message": "Email, password, first_name, last_name, and country are required",
  "data": {
    "status": 400
  }
}
```

#### Invalid Email Format (400)
```json
{
  "code": "invalid_email",
  "message": "Please provide a valid email address",
  "data": {
    "status": 400
  }
}
```

#### Email Already Exists (400)
```json
{
  "code": "email_exists",
  "message": "An account with this email already exists",
  "data": {
    "status": 400
  }
}
```

#### User Creation Failed (500)
```json
{
  "code": "user_creation_failed",
  "message": "Unable to create user account",
  "data": {
    "status": 500
  }
}
```

## Example Usage

### JavaScript Fetch API
```javascript
const signupData = {
  email: 'user@example.com',
  password: 'securepassword123',
  first_name: 'John',
  last_name: 'Doe',
  phone_number: '+1234567890',
  country: 'United States',
  state: 'New York',
  referred_by: 'R-SOS2026-123'
};

fetch('/wp-json/bema-hub/v1/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(signupData),
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Signup successful:', data.message);
    // Save email for OTP verification
    localStorage.setItem('pendingUserEmail', data.user_email);
  } else {
    console.error('Signup failed:', data.message);
  }
})
.catch(error => {
  console.error('Signup error:', error);
});
```

### cURL
```bash
curl -X POST \
  https://yoursite.com/wp-json/bema-hub/v1/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "country": "United States",
  "state": "New York",
  "referred_by": "R-SOS2026-123"
}'
```

## Implementation Details

### User Data Storage
- User accounts are created in the standard WordPress `wp_users` table
- Custom user metadata is stored in the `wp_usermeta` table with the `bema_` prefix
- Phone numbers are encrypted before storage for security
- All required fields are validated before processing

### Verification Process
1. User submits signup data
2. System validates input and checks for existing email
3. User account is created with default values:
   - `bema_tier_level`: "Opt-In"
   - `bema_account_type`: "subscriber"
   - `bema_email_verified`: false
   - `bema_phone_verified`: false
   - `bema_fraud_flag`: false
4. Unique device ID is generated and stored
5. OTP is generated and sent for email verification
6. User must verify OTP to complete registration

### Security Considerations
- Passwords are hashed using WordPress's secure hashing algorithm
- Phone numbers are encrypted before storage
- OTP codes expire after 10 minutes
- OTP codes are SHA256 hashed before storage
- All authentication events are logged for security monitoring
- Input validation prevents injection attacks
- Rate limiting should be implemented at the server level

### Error Handling
- All required fields are validated
- Email format is validated
- Existing email addresses are checked
- Database errors are handled gracefully
- Detailed error information is logged for debugging
- User-facing error messages do not expose sensitive information

## Related Endpoints
- [OTP Verification](endpoint-auth-verify-otp.md) - Verify the OTP sent during signup
- [Login](endpoint-auth-login.md) - Login after email verification