# Social Login Endpoint

## Endpoint
`POST /wp-json/bema-hub/v1/auth/social-login`

## Description
Authenticate users through social providers (Google, Facebook, Twitter). This endpoint handles both new user registration and existing user login through social authentication. Includes user's avatar URL from WordPress's built-in avatar system.

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
  "state": "string"
}
```

## Parameters

| Parameter     | Type   | Required | Description                          |
|---------------|--------|----------|--------------------------------------|
| provider      | string | Yes      | Social provider (google, facebook, twitter) |
| provider_id   | string | Yes      | Unique ID from the social provider   |
| email         | string | Yes      | User's email address                 |
| first_name    | string | Yes      | User's first name                    |
| last_name     | string | Yes      | User's last name                     |
| phone_number  | string | No       | User's phone number                  |
| country       | string | No       | User's country                       |
| state         | string | No       | User's state                         |

## Success Response

### Code: 200 OK
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": 123,
  "user_login": "user_example_com",
  "user_email": "user@example.com",
  "user_display_name": "John Doe",
  "first_name": "John",
  "last_name": "Doe",
  "avatar_url": "https://secure.gravatar.com/avatar/23463b99b62a72f26ed677cc556c44e8?s=96&d=mm&r=g"
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

### JavaScript Fetch API
```javascript
const socialData = {
  provider: 'google',
  provider_id: '1234567890',
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone_number: '+1234567890',
  country: 'United States',
  state: 'New York'
};

fetch('/wp-json/bema-hub/v1/auth/social-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(socialData),
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Social login successful');
    // Save the token for authenticated requests
    localStorage.setItem('authToken', data.token);
  } else {
    console.error('Social login failed:', data.message);
  }
})
.catch(error => {
  console.error('Social login error:', error);
});
```

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
  "state": "New York"
}'
```

## Implementation Details

### Authentication Flow
1. User authenticates with social provider
2. Client receives user data from social provider
3. Client sends data to this endpoint
4. System checks for existing account with provider ID
5. If not found, checks for existing account with email
6. If neither exists, creates new account
7. Returns JWT token for authenticated access with avatar URL

### Account Linking
- If a user has an existing account with the same email, the social account is linked
- Provider-specific IDs are stored in user meta fields:
  - `bema_google_id`
  - `bema_facebook_id`
  - `bema_twitter_id`
- This allows users to login with multiple social providers

### New User Registration
When creating a new user through social login:
1. Username is generated from email (user@example.com becomes user_example_com)
2. Random password is generated for security
3. User metadata is populated from social data
4. Default values are set:
   - `bema_tier_level`: "Opt-In"
   - `bema_account_type`: "subscriber"
   - `bema_email_verified`: true (social login users are considered verified)
   - `bema_phone_verified`: true (if phone number provided)
   - `bema_fraud_flag`: false
5. Unique device ID is generated and stored
6. Avatar URL is included from WordPress's built-in avatar system

### Existing User Login
When an existing user logs in through social authentication:
1. System finds user by provider ID or email
2. Updates last signin timestamp
3. Links social account if not already linked
4. Generates and returns JWT token with avatar URL

### User Data Included in Response
The response includes comprehensive user information:
- **success**: Boolean indicating successful authentication
- **token**: JWT token for authenticated requests
- **user_id**: WordPress user ID
- **user_login**: WordPress username
- **user_email**: User's email address
- **user_display_name**: User's display name
- **first_name**: User's first name (WordPress field)
- **last_name**: User's last name (WordPress field)
- **avatar_url**: URL to user's avatar from WordPress's `get_avatar` function

## Security Considerations
- Social provider IDs are stored securely in user meta
- Email verification is bypassed for social login users
- Phone numbers are encrypted before storage
- All authentication events are logged for security monitoring
- Input validation prevents injection attacks
- Rate limiting should be implemented at the server level

## Error Handling
- All required fields are validated
- Provider is validated against allowed providers
- Database errors are handled gracefully
- Detailed error information is logged for debugging
- User-facing error messages do not expose sensitive information

## Avatar Information

The response includes an `avatar_url` field that contains the URL to the user's avatar. This is generated using WordPress's built-in `get_avatar()` function, which:
- Uses Gravatar by default based on the user's email address
- Falls back to a default avatar if no Gravatar is found
- Returns an avatar sized at 96x96 pixels
- Can be customized with themes and plugins

## Related Endpoints
- [Login](endpoint-auth-login.md) - Traditional username/password login
- [Signup](endpoint-auth-signup.md) - Email-based registration
- [Validate Token](endpoint-auth-validate.md) - Token validation