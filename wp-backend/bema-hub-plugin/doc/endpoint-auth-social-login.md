# Social Login Endpoint

## Endpoint Details
- **URL**: `/wp-json/bema-hub/v1/auth/social-login`
- **Method**: `POST`
- **Authentication**: None (Public endpoint)
- **Permissions**: Anyone with valid social credentials

## Description
This endpoint authenticates users through social providers (Google, Facebook, Twitter). If the user doesn't exist, a new account is created. If the user exists but hasn't linked their social account, it links the social account to their existing profile.

## Request Body
```json
{
  "provider": "string",
  "provider_id": "string",
  "email": "string",
  "first_name": "string",
  "last_name": "string",
  "phone_number": "string",
  "country": "string",
  "city": "string"
}
```

### Parameters
| Parameter     | Type   | Required | Description                          |
|---------------|--------|----------|--------------------------------------|
| provider      | string | Yes      | Social provider (google, facebook, twitter) |
| provider_id   | string | Yes      | Unique ID from the social provider   |
| email         | string | Yes      | User's email address                 |
| first_name    | string | Yes      | User's first name                    |
| last_name     | string | Yes      | User's last name                     |
| phone_number  | string | No       | User's phone number (encrypted)      |
| country       | string | No       | User's country                       |
| city          | string | No       | User's city                          |

## Success Response

### Code: 200 OK
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MTYxNjE2MTYsIm5iZiI6MTYxNjE2MTYxNiwiZXhwIjoxNjE2NzY2NDE2LCJkYXRhIjp7InVzZXJfaWQiOjEsInVzZXJfbG9naW4iOiJhZG1pbiIsInVzZXJfZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSJ9fQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "user_id": 123,
  "user_login": "user_example_com",
  "user_email": "user@example.com",
  "user_display_name": "John Doe"
}
```

## Error Responses

### Missing Required Fields
**Code**: 400 Bad Request
```json
{
  "code": "missing_fields",
  "message": "Provider, provider ID, email, first name, and last name are required",
  "data": {
    "status": 400
  }
}
```

### Invalid Provider
**Code**: 400 Bad Request
```json
{
  "code": "invalid_provider",
  "message": "Invalid provider. Must be google, facebook, or twitter",
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
  https://yoursite.com/wp-json/bema-hub/v1/auth/social-login \
  -H 'Content-Type: application/json' \
  -d '{
    "provider": "google",
    "provider_id": "1234567890",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "country": "United States",
    "city": "New York"
  }'
```

### JavaScript (Fetch API)
```javascript
fetch('/wp-json/bema-hub/v1/auth/social-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    provider: 'google',
    provider_id: '1234567890',
    email: 'user@example.com',
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
    // Store the authentication token for future API requests
    localStorage.setItem('authToken', data.token);
    console.log('Social login successful');
  } else {
    console.error('Social login failed:', data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

## Implementation Details

This endpoint is implemented in the `Bema_Hub_REST_API` class in the `social_login` method. The process involves:

1. Validating that all required parameters are provided
2. Validating the provider is one of the supported options
3. Checking if a user already exists with the provider ID
4. If not, checking if a user exists with the email address
5. If no user exists, creating a new WordPress user
6. If a user exists with the email but not the provider ID, linking the social account
7. Setting user meta fields with the provided information
8. Encrypting sensitive data like phone numbers
9. Generating a device ID for fraud detection
10. Marking social login users as email verified
11. Updating the last signin time
12. Generating a JWT token for the user
13. Returning the token and user information

## Security Considerations

1. All communication must use HTTPS encryption
2. Provider IDs are stored securely in user meta
3. Phone numbers are encrypted before storage
4. Social login users are automatically marked as email verified
5. Device IDs are generated for fraud detection
6. Rate limiting should be implemented to prevent abuse
7. OAuth tokens from providers should be handled securely in the frontend
8. Failed social login attempts should be logged for security monitoring