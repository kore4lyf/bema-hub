# Update User Profile Endpoint

## Endpoint Details
- **URL**: `/wp-json/bema-hub/v1/profile`
- **Method**: `PUT`
- **Authentication**: Required (Bearer Token)
- **Permissions**: Authenticated users

## Description
This endpoint updates the profile information of the authenticated user, including both WordPress user fields and custom user meta fields. Note that `bema_referred_by` cannot be updated as it's only set during signup, and avatars are managed through WordPress's built-in avatar system.

## Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Type: application/json
```

### Parameters
| Header        | Value                     | Required | Description                          |
|---------------|---------------------------|----------|--------------------------------------|
| Authorization | Bearer {JWT_TOKEN}        | Yes      | Valid JWT token                      |
| Content-Type  | application/json          | Yes      | JSON content type                    |

## Request Body
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "display_name": "John Doe",
  "bema_phone_number": "+1234567890",
  "bema_country": "United States",
  "bema_state": "California"
}
```

### Request Fields
| Field              | Type   | Required | Description                          |
|--------------------|--------|----------|--------------------------------------|
| first_name         | string | No       | WordPress user first name            |
| last_name          | string | No       | WordPress user last name             |
| display_name       | string | No       | WordPress user display name          |
| bema_phone_number  | string | No       | Phone number (will be encrypted)     |
| bema_country       | string | No       | User's country                       |
| bema_state         | string | No       | User's state                         |

## Success Response

### Code: 200 OK
```json
{
  "id": 123,
  "username": "user_example_com",
  "email": "user@example.com",
  "display_name": "John Doe",
  "first_name": "John",
  "last_name": "Doe",
  "avatar_url": "https://secure.gravatar.com/avatar/23463b99b62a72f26ed677cc556c44e8?s=96&d=mm&r=g",
  "bema_phone_number": "UzJWbWMzQnBjeUF4TURB",
  "bema_country": "United States",
  "bema_state": "California",
  "bema_referred_by": "R-SOS2026-123",
  "bema_tier_level": "Opt-In",
  "bema_account_type": "subscriber",
  "bema_email_verified": true,
  "bema_phone_verified": true,
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

### Update Failed
**Code**: 500 Internal Server Error
```json
{
  "code": "update_failed",
  "message": "Failed to update user profile",
  "data": {
    "status": 500
  }
}
```

## Usage Examples

### cURL
```bash
curl -X PUT \
  https://yoursite.com/wp-json/bema-hub/v1/profile \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "display_name": "John Doe",
    "bema_phone_number": "+1234567890",
    "bema_country": "United States",
    "bema_state": "California"
  }'
```

### JavaScript (Fetch API)
```javascript
const token = localStorage.getItem('authToken');

const profileData = {
  first_name: 'John',
  last_name: 'Doe',
  display_name: 'John Doe',
  bema_phone_number: '+1234567890',
  bema_country: 'United States',
  bema_state: 'California'
};

fetch('/wp-json/bema-hub/v1/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(profileData),
})
.then(response => response.json())
.then(data => {
  if (response.ok) {
    console.log('Profile updated successfully:', data);
  } else {
    if (data.code === 'token_expired' || data.code === 'invalid_token') {
      // Token is invalid, redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    console.error('Profile update failed:', data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

## Implementation Details

This endpoint is implemented in the `Bema_Hub_User_Controller` class in the `update_profile` method. The process involves:

1. Extracting the token from the Authorization header
2. Validating the token using the JWT authentication system
3. If the token is valid, extracting the user ID from the token payload
4. Updating the specified WordPress user fields (first_name, last_name, display_name)
5. Updating the specified custom user meta fields (excluding `bema_referred_by`)
6. Returning the updated user profile data including all custom fields and avatar URL

The endpoint uses a permission callback (`validate_jwt_permission`) to validate the token before processing the request.

## Updatable Fields

The following fields can be updated through this endpoint:

### WordPress User Fields
- **first_name**: User's first name in WordPress
- **last_name**: User's last name in WordPress
- **display_name**: User's display name in WordPress

### Custom User Meta Fields
- **bema_phone_number**: Phone number (will be encrypted before storage)
- **bema_country**: User's country
- **bema_state**: User's state

### Non-Updatable Fields
- **bema_referred_by**: Cannot be updated (only set during signup)
- **bema_tier_level**: System-managed field
- **bema_account_type**: System-managed field
- **bema_email_verified**: System-managed field
- **bema_phone_verified**: System-managed field
- **bema_fraud_flag**: System-managed field
- **bema_device_id**: System-managed field
- **bema_last_signin**: System-managed field
- **bema_last_signout**: System-managed field
- **bema_google_id**: System-managed field
- **bema_facebook_id**: System-managed field
- **bema_twitter_id**: System-managed field

## Security Considerations

1. All communication should happen over HTTPS
2. Tokens must be validated before updating user data
3. User data should only be updatable by the authenticated user
4. Phone numbers are encrypted before storage
5. Rate limiting should be implemented to prevent abuse
6. Input validation should be performed on all fields
7. Sensitive fields cannot be updated through this endpoint

## Avatar/Profile Picture Management

This endpoint does not handle avatar/profile picture updates. WordPress uses its built-in avatar system which:

1. Uses Gravatar by default based on the user's email address
2. Falls back to a default avatar if no Gravatar is found
3. Can be customized with themes and plugins
4. Cannot be directly updated through this API endpoint

To change their avatar, users need to:
1. Update their email address to one associated with a Gravatar
2. Or use a WordPress plugin/theme that provides custom avatar upload functionality