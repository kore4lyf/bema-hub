# Signin Response Fix Summary

## Issue
Users were receiving empty first_name and last_name fields in the signin response:
```json
{
  "first_name": "",
  "last_name": ""
}
```

## Root Cause
The issue was that WordPress stores first_name and last_name as user meta fields, not as direct properties of the user object. The JWT authentication class was incorrectly accessing `$user->first_name` and `$user->last_name` which were empty.

## Solution
Modified the JWT authentication class to properly retrieve first_name and last_name from user meta fields using `get_user_meta()` function:

1. In `generate_token()` method:
   ```php
   // Get first_name and last_name from user meta (WordPress stores these as meta fields)
   $first_name = \get_user_meta($user_id, 'first_name', true);
   $last_name = \get_user_meta($user_id, 'last_name', true);
   ```

2. In `authenticate_and_generate_token()` method:
   ```php
   // Get first_name and last_name from user meta (WordPress stores these as meta fields)
   $first_name = \get_user_meta($user->ID, 'first_name', true);
   $last_name = \get_user_meta($user->ID, 'last_name', true);
   ```

## Response Format
The signin endpoint now returns the response exactly as documented, without a "success" field:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user_id": 1,
  "user_login": "admin",
  "user_email": "admin@example.com",
  "user_display_name": "Administrator",
  "first_name": "Admin",
  "last_name": "User",
  "avatar_url": "https://secure.gravatar.com/avatar/..."
}
```

## Files Modified
1. `includes/auth/class-bema-hub-jwt-auth.php` - Fixed first_name and last_name retrieval
2. `doc/endpoint-reference.md` - Added clarification about the response format

## Testing
After the fix, the signin response now correctly includes the user's first and last names instead of empty strings, matching the documented format exactly.