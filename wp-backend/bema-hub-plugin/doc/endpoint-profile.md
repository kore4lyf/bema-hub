# User Profile Endpoint

## Endpoint Details
- **URL**: `/wp-json/bema-hub/v1/profile`
- **Method**: `GET`
- **Authentication**: Required (Bearer Token)
- **Permissions**: Authenticated users

## Description
This endpoint returns the profile information of the authenticated user, including all custom user meta fields and WordPress avatar. Note that `bema_referred_by` cannot be updated as it's only set during signup.

## Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### Parameters
| Header        | Value                     | Required | Description                          |
|---------------|---------------------------|----------|--------------------------------------|
| Authorization | Bearer {JWT_TOKEN}        | Yes      | Valid JWT token                      |

## Success Response

### Code: 200 OK
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "display_name": "Administrator",
  "first_name": "Admin",
  "last_name": "User",
  "avatar_url": "https://secure.gravatar.com/avatar/23463b99b62a72f26ed677cc556c44e8?s=96&d=mm&r=g",
  "bema_phone_number": "UzJWbWMzQnBjeUF4TURB",
  "bema_country": "United States",
  "bema_state": "New York",
  "bema_referred_by": "R-SOS2026-123",
  "bema_tier_level": "Opt-In",
  "bema_account_type": "subscriber",
  "bema_email_verified": true,
  "bema_phone_verified": false,
  "bema_fraud_flag": false,
  "bema_device_id": "device_5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f",
  "bema_last_signin": 1609459200,
  "bema_last_signout": 1609459200,
  "bema_google_id": "123456789012345678901",
  "bema_facebook_id": "1234567890123456",
  "bema_twitter_id": "123456789"
}
```

## Error Responses

### Missing Authorization Header
**Code**: 401 Unauthorized
```json
{
  "code": "missing_auth_header",
  "message": "Authorization header is required",
  "data": {
    "status": 401
  }
}
```

### Invalid Authorization Header Format
**Code**: 401 Unauthorized
```json
{
  "code": "invalid_auth_header",
  "message": "Invalid authorization header format",
  "data": {
    "status": 401
  }
}
```

### Invalid Token
**Code**: 401 Unauthorized
```json
{
  "code": "invalid_token",
  "message": "Invalid token signature",
  "data": {
    "status": 401
  }
}
```

### Expired Token
**Code**: 401 Unauthorized
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

## Usage Examples

### cURL
```bash
curl -X GET \
  https://yoursite.com/wp-json/bema-hub/v1/profile \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
```

### JavaScript (Fetch API)
```javascript
const token = localStorage.getItem('authToken');

fetch('/wp-json/bema-hub/v1/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
.then(response => response.json())
.then(data => {
  if (response.ok) {
    console.log('Profile data:', data);
  } else {
    if (data.code === 'token_expired' || data.code === 'invalid_token') {
      // Token is invalid, redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    console.error('Profile request failed:', data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

## Implementation Details

This endpoint is implemented in the `Bema_Hub_User_Controller` class in the `get_profile` method. The process involves:

1. Extracting the token from the Authorization header
2. Validating the token using the JWT authentication system
3. If the token is valid, extracting the user ID from the token payload
4. Retrieving the user's profile information from WordPress
5. Retrieving all custom user meta fields
6. Getting the user's avatar URL using WordPress's `get_avatar()` function
7. Returning the user's profile data including all custom fields and avatar URL in the response

The endpoint uses a permission callback (`validate_jwt_permission`) to validate the token before processing the request.

## Security Considerations

1. All communication should happen over HTTPS
2. Tokens must be validated before accessing user data
3. User data should only be accessible to the authenticated user
4. Rate limiting should be implemented to prevent abuse
5. Sensitive user information should not be exposed through this endpoint

## Custom User Meta Fields Included

The response includes all custom user meta fields:
- **bema_phone_number**: Encrypted phone number
- **bema_country**: User's country
- **bema_state**: User's state
- **bema_referred_by**: Referral code or user ID (cannot be updated)
- **bema_tier_level**: User's tier level
- **bema_account_type**: Account type
- **bema_email_verified**: Email verification status
- **bema_phone_verified**: Phone verification status
- **bema_fraud_flag**: Fraud detection flag
- **bema_device_id**: Unique device identifier
- **bema_last_signin**: Last signin timestamp
- **bema_last_signout**: Last signout timestamp
- **bema_google_id**: Google user ID for social login
- **bema_facebook_id**: Facebook user ID for social login
- **bema_twitter_id**: Twitter user ID for social login

## Avatar/Profile Picture

The response includes an `avatar_url` field that contains the URL to the user's avatar. This is generated using WordPress's built-in `get_avatar()` function, which:
- Uses Gravatar by default
- Falls back to a default avatar if no Gravatar is found
- Returns an avatar based on the user's email address
- Can be customized with themes and plugins

## Important Notes

- `bema_referred_by` is only set during signup and cannot be updated later
- Standard WordPress fields `first_name` and `last_name` are included in the response
- No custom `bema_first_name` or `bema_last_name` fields are used