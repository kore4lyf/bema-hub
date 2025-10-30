# Mailer Class Implementation

## Overview
This document describes the implementation of the `Bema_Hub_Mailer` class, a static PHP mailer class designed for the Bema Hub WordPress plugin. The class provides a simple, consistent interface for sending emails throughout the plugin.

## Features

### 1. Static Interface
- Can be imported and used statically from anywhere in the plugin
- No need to instantiate the class
- Simple method calls for sending emails

### 2. OTP Email Support
- Specialized method for sending OTP (One-Time Password) emails
- Automatic subject and message formatting based on OTP purpose
- Support for different OTP types (email verification, password reset, etc.)

### 3. Generic Email Support
- Method for sending generic emails with custom subject and message
- Support for custom headers
- Flexible email sending for various use cases

### 4. SMTP Integration
- Automatically uses SMTP settings configured in the admin panel
- Falls back to WordPress default mail functionality if SMTP not configured
- Proper handling of from name and email address

## Implementation Details

### Class Structure
```php
namespace Bema_Hub;

class Bema_Hub_Mailer {
    // Static methods only
}
```

### Methods

#### 1. send_otp_email()
Sends an OTP email with preformatted subject and message based on purpose.

**Parameters:**
- `$to_email` (string): Recipient email address
- `$otp_code` (string): The OTP code to send
- `$purpose` (string): Purpose of the OTP (default: 'general')

**Returns:**
- `true` on success
- `\WP_Error` on failure

**Usage:**
```php
$result = \Bema_Hub\Bema_Hub_Mailer::send_otp_email(
    'user@example.com', 
    '123456', 
    'password_reset'
);
```

#### 2. send_email()
Sends a generic email with custom subject and message.

**Parameters:**
- `$to_email` (string): Recipient email address
- `$subject` (string): Email subject
- `$message` (string): Email message
- `$headers` (array): Additional headers (optional)

**Returns:**
- `true` on success
- `\WP_Error` on failure

**Usage:**
```php
$result = \Bema_Hub\Bema_Hub_Mailer::send_email(
    'user@example.com',
    'Welcome to Bema Hub',
    'Thank you for joining our platform!'
);
```

#### 3. test_email_configuration()
Sends a test email to verify SMTP configuration.

**Parameters:**
- `$to_email` (string): Recipient email address for test

**Returns:**
- `true` on success
- `\WP_Error` on failure

**Usage:**
```php
$result = \Bema_Hub\Bema_Hub_Mailer::test_email_configuration('admin@example.com');
```

## Integration with Existing Code

### OTP Controller Integration
The OTP controller has been updated to use the new mailer class:
- `reset_password_request()` method now sends OTP emails using the mailer
- `resend_otp()` method now sends OTP emails using the mailer
- Proper error handling for email sending failures

### SMTP Settings Integration
The mailer class automatically retrieves SMTP settings from WordPress options:
- Uses `bema_hub_smtp_settings` option
- Automatically applies from name and email from settings
- Falls back to WordPress default mail functionality if SMTP not configured

## Usage Examples

### Sending Password Reset OTP
```php
// In OTP controller
$otp_code = rand(100000, 999999);
$result = \Bema_Hub\Bema_Hub_Mailer::send_otp_email(
    $user->user_email, 
    $otp_code, 
    'password_reset'
);

if (is_wp_error($result)) {
    // Handle error
    error_log('Failed to send OTP email: ' . $result->get_error_message());
}
```

### Sending Email Verification OTP
```php
// In signup process
$otp_code = rand(100000, 999999);
$result = \Bema_Hub\Bema_Hub_Mailer::send_otp_email(
    $user->user_email, 
    $otp_code, 
    'email_verification'
);
```

### Sending Generic Email
```php
// Custom notification
$result = \Bema_Hub\Bema_Hub_Mailer::send_email(
    'user@example.com',
    'Account Update',
    'Your account settings have been updated.'
);
```

## Error Handling

### Success Cases
- Returns `true` when email is sent successfully
- Logs success in plugin logger (if available)

### Failure Cases
- Returns `\WP_Error` with descriptive error message
- Error codes:
  - `email_send_failed`: General email sending failure
- Logs errors in plugin logger (if available)

### SMTP Configuration Issues
- If SMTP settings are incomplete, falls back to WordPress default mail
- Still attempts to send email even if SMTP not properly configured
- Provides clear error messages for debugging

## Security Considerations

### Email Content
- No sensitive information included in email content
- OTP codes are not logged (except for development/debugging purposes)
- Proper sanitization of email addresses

### SMTP Credentials
- SMTP credentials stored securely in WordPress options
- Not exposed in email content or logs
- Uses WordPress's built-in settings API

### Rate Limiting
- No built-in rate limiting in mailer class
- Should be implemented at the calling level if needed
- Consider using WordPress transients for rate limiting

## Testing and Verification

### Unit Testing
The mailer class can be tested by:
1. Configuring SMTP settings in the admin panel
2. Using the test email functionality
3. Verifying emails are received correctly
4. Checking error handling with invalid configurations

### Integration Testing
1. Test OTP email sending in reset password flow
2. Test OTP email sending in resend OTP flow
3. Test generic email sending
4. Verify proper error handling in all scenarios

## Future Enhancements

### Template System
- Add support for HTML email templates
- Implement email template management
- Support for custom email designs

### Queue System
- Implement email queue for better performance
- Add retry mechanism for failed emails
- Support for batch email sending

### Analytics
- Track email sending statistics
- Monitor delivery success rates
- Log email open/click tracking (if supported)

### Advanced Features
- Support for email attachments
- CC and BCC recipient support
- Email scheduling functionality
- Support for multiple SMTP profiles

## Best Practices

### When Using the Mailer Class
1. Always check return value for errors
2. Use appropriate OTP purpose for proper formatting
3. Handle errors gracefully without exposing sensitive information
4. Log errors for debugging and monitoring

### SMTP Configuration
1. Use secure SMTP settings (TLS/SSL)
2. Regularly test email configuration
3. Monitor email delivery rates
4. Keep SMTP credentials secure

## Troubleshooting

### Common Issues
1. **Emails not being sent**: Check SMTP configuration in admin panel
2. **Emails going to spam**: Verify SPF/DKIM records for sending domain
3. **Authentication failures**: Check SMTP username and password
4. **Connection timeouts**: Verify SMTP host and port settings

### Debugging Steps
1. Use the test email functionality in the admin panel
2. Check WordPress error logs
3. Verify SMTP settings are saved correctly
4. Test with different email providers