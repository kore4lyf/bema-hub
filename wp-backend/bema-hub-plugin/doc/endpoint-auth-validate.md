# Authentication Validate Endpoint

## Endpoint Details
- **URL**: `/wp-json/bema-hub/v1/auth/validate`
- **Method**: `POST`
- **Authentication**: None (Public endpoint)
- **Permissions**: Any user with a valid token

## Description
This endpoint validates a JWT token to check if it's still valid and hasn't expired. It's useful for checking token validity without making a request to a protected endpoint.

## Request Body
```json
{
  "token": "string"
}
```

### Parameters
| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| token     | string | Yes      | JWT token to validate                |

## Success Response

### Code: 200 OK
```json
{
  "valid": true,
  "data": {
    "user_id": 1,
    "user_login": "admin",
    "user_email": "admin@example.com"
  }
}
```

## Error Responses

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

### Missing Token
**Code**: 400 Bad Request
```json
{
  "code": "missing_token",
  "message": "Token is required",
  "data": {
    "status": 400
  }
}
```

## Usage Examples

### cURL
```bash
curl -X POST \
  https://yoursite.com/wp-json/bema-hub/v1/auth/validate \
  -H 'Content-Type: application/json' \
  -d '{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }'
```

### JavaScript (Fetch API)
```javascript
fetch('/wp-json/bema-hub/v1/auth/validate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
  }),
})
.then(response => response.json())
.then(data => {
  if (response.ok) {
    if (data.valid) {
      console.log('Token is valid');
    } else {
      console.log('Token is invalid');
    }
  } else {
    console.error('Validation failed:', data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

## Implementation Details

This endpoint is implemented in the `Bema_Hub_REST_API` class in the `validate_token` method. The process involves:

1. Validating that a token is provided
2. Parsing the token into its components (header, payload, signature)
3. Verifying the token signature using HMAC-SHA256 with the `JWT_SECRET`
4. Checking that the token hasn't expired
5. Returning the validation result and user data if valid

## Security Considerations

1. Tokens are validated using a secure HMAC-SHA256 algorithm
2. Token expiration is checked to prevent use of expired tokens
3. The `JWT_SECRET` should be a strong, unique value stored in `wp-config.php`
4. All communication should happen over HTTPS
5. Tokens should be validated before making requests to protected endpoints