# HTML Error Sanitization Implementation

## Overview
This document describes the implementation of HTML error sanitization in the Bema Hub plugin's JWT authentication system. The solution prevents HTML content from being returned in API responses, which was causing issues with clients that cannot properly render HTML (like toasters).

## Problem Addressed
The WordPress `wp_authenticate` function was returning error messages with HTML content, such as:
```json
{
    "code": "incorrect_password",
    "message": "<strong>Error:<\/strong> The password you entered for the email address <strong>akfaleye@gmail.com<\/strong> is incorrect. <a href=\"http:\/\/bemahub.local\/wp-login.php?action=lostpassword\">Lost your password?<\/a>",
    "data": null
}
```

This is not suitable for API responses and causes issues with clients that expect plain text.

## Solution Implemented
Added error message sanitization in the `authenticate_and_generate_token` method to:
- Remove HTML tags from error messages
- Provide clean, user-friendly error messages
- Maintain appropriate HTTP status codes

## Implementation Details

### Enhanced authenticate_and_generate_token() Method
```php
public function authenticate_and_generate_token($username_or_email, $password) {
    
    // Authenticate user
    $user = \wp_authenticate($username_or_email, $password);
    
    if (\is_wp_error($user)) {
        // Sanitize the error message to remove HTML
        $error_code = $user->get_error_code();
        $error_message = $user->get_error_message();
        
        // Remove HTML tags and clean up the message
        $clean_message = \wp_strip_all_tags($error_message);
        
        // Create a cleaner error message
        if ($error_code === 'incorrect_password') {
            $clean_message = 'The password you entered is incorrect. Please try again.';
        } elseif ($error_code === 'invalid_email' || $error_code === 'invalid_username') {
            $clean_message = 'Invalid username or email address. Please check and try again.';
        }
        
        // Create a new WP_Error with clean message
        $clean_error = new \WP_Error($error_code, $clean_message, $user->get_error_data());
        
        // ... logging ...
        return $clean_error;
    }
    
}
```

## Error Message Mapping

### Before Sanitization
- `incorrect_password`: "Error: The password you entered for the email address akfaleye@gmail.com is incorrect. Lost your password?"
- `invalid_email`: "ERROR: Invalid email address. Lost your password?"

### After Sanitization
- `incorrect_password`: "The password you entered is incorrect. Please try again."
- `invalid_email`: "Invalid username or email address. Please check and try again."
- `invalid_username`: "Invalid username or email address. Please check and try again."

## Benefits

### 1. API Consistency
- Clean, plain text error messages
- No HTML content in JSON responses
- Consistent with REST API best practices

### 2. Client Compatibility
- Works with simple clients (like toasters)
- No HTML parsing required
- Better accessibility

### 3. Security
- Prevents potential XSS issues
- No HTML injection risks
- Cleaner error handling

## Technical Notes

### Static Analysis Warnings
The implementation may show static analysis warnings for WordPress core functions:
- These are normal and do not affect runtime functionality
- Functions are properly prefixed with backslashes for global namespace access

### WordPress Integration
- Uses WordPress's `wp_strip_all_tags` function for HTML removal
- Maintains original error codes for consistency
- Preserves error data for debugging

## Usage Instructions

No changes are required for existing functionality. The sanitization works automatically:
1. When authentication fails, HTML is automatically removed from error messages
2. Clean error messages are returned to clients
3. Original error codes are preserved for debugging

## Testing

### Error Message Verification
- Verify that no HTML tags appear in error responses
- Check that error messages are user-friendly
- Confirm that error codes remain unchanged

### Client Compatibility
- Test with simple HTTP clients
- Verify compatibility with non-browser clients
- Ensure proper JSON formatting

## Monitoring

### Log File Location
- Path: `/wp-content/uploads/bema-crowdfunding-logger/jwt-auth/jwt-auth.log`

### Expected Log Pattern
After the implementation, you should see:
- INFO entries for authentication attempts
- WARNING entries for failed authentications with clean messages
- No HTML content in log entries