# First Name and Last Name Fix Summary

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

## Files Modified
- `includes/auth/class-bema-hub-jwt-auth.php`

## Testing
After the fix, the signin response now correctly includes the user's first and last names:
```json
{
  "first_name": "John",
  "last_name": "Doe"
}
```

This ensures that the API response matches the documented format and provides the expected user data to the frontend.