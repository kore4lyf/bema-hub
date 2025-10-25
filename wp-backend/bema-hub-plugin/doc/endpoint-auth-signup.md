# User Signup Endpoint

## Endpoint Details
- **URL**: `/wp-json/bema-hub/v1/auth/signup`
- **Method**: `POST`
- **Authentication**: None (Public endpoint)
- **Permissions**: Anyone can register

## Description
This endpoint registers new users in the system. It validates the provided information, creates a new WordPress user, and sends an OTP code for email verification.

## Request Body
```json
{
  "email": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string",
  "phone_number": "string",
  "country": "string",
  "city": "string",
  "referred_by": "string"
}
```

### Parameters
| Parameter     | Type   | Required | Description                          |
|---------------|--------|----------|--------------------------------------|
| email         | string | Yes      | User's email address                 |
| password      | string | Yes      | Account password                     |
| first_name    | string | Yes      | User's first name                    |
| last_name     | string | Yes      | User's last name                     |
| phone_number  | string | No       | User's phone number (encrypted)      |
| country       | string | Yes      | User's country                       |
| city          | string | No       | User's city                          |
| referred_by   | string | No       | Referral code                        |

## Success Response

### Code: 200 OK
```json
{
  "success": true,
  "message": "Account created successfully. Please check your email for verification code.",
  "user_email": "user@example.com"
}
```

## Error Responses

### Missing Required Fields
**Code**: 400 Bad Request
```json
{
  "code": "missing_fields",
  "message": "Email, password, first name, last name, and country are required",
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

### Email Already Exists
**Code**: 400 Bad Request
```json
{
  "code": "email_exists",
  "message": "An account with this email already exists",
  "data": {
    "status": 400
  }
}
```

### User Creation Failed
**Code**: 500 Internal Server Error
```json
{
  "code": "user_creation_failed",
  "message": "Unable to create user account",
  "data": {
    "status": 500
  }
}
```

## Usage Examples

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
    "city": "New York"
  }'
```

### JavaScript (Fetch API)
```javascript
fetch('/wp-json/bema-hub/v1/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '+1234567890',
    country: 'United States',
    city: 'New York'
  }),
})
.then(response => response.json())
.then(data => {
  if (response.ok) {
    console.log('Account created successfully');
    // Save email for OTP verification
    localStorage.setItem('pendingUserEmail', data.user_email);
  } else {
    console.error('Signup failed:', data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

## Implementation Details

This endpoint is implemented in the `Bema_Hub_REST_API` class in the `signup` method. The process involves:

1. Validating that all required parameters are provided
2. Validating the email format
3. Checking if the email already exists
4. Generating a unique username from the email
5. Creating a new WordPress user with `wp_create_user`
6. Setting user meta fields with the provided information
7. Encrypting sensitive data like phone numbers
8. Generating a device ID for fraud detection
9. Creating an OTP code for email verification (10-minute expiration)
10. Sending the OTP code to the user's email (in a real implementation)

## Security Considerations

1. All communication must use HTTPS encryption
2. Passwords are never stored in logs or responses
3. Phone numbers are encrypted before storage
4. Input validation ensures proper data types
5. Usernames are automatically generated to prevent conflicts
6. OTP codes are hashed before storage
7. Device IDs are generated for fraud detection
8. Rate limiting should be implemented to prevent abuse
9. OTP codes expire after 10 minutes for enhanced security