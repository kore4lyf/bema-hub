# Email Template System Documentation

## Overview
This document describes the email template system implemented for the Bema Hub plugin. The system allows administrators to customize email templates for various user actions such as password resets, OTP verification, and password change confirmations.

## Features
1. **HTML Email Templates**: Professional, responsive email templates
2. **Admin Configuration**: Easily customizable through WordPress admin panel
3. **Template Variables**: Dynamic content placeholders
4. **Multiple Templates**: Separate templates for different email types
5. **Shared Variables**: Common branding elements across all templates
6. **Password Reset Links**: Secure password reset functionality with token-based links
7. **Fallback Support**: Plain text emails when HTML templates fail

## Email Templates

### 1. Password Reset Template
- **File**: `templates/password-reset.html`
- **Purpose**: Sent when users request a password reset
- **Variables**:
  - `{{LOGO_URL}}` - Company logo URL
  - `{{USER_NAME}}` - Recipient's name
  - `{{WEBSITE_NAME}}` - Website name
  - `{{RESET_LINK}}` - Secure password reset link with token
  - `{{COMPANY_EMAIL}}` - Company email address
  - `{{COMPANY_PHONE}}` - Company phone number
  - `{{FACEBOOK_URL}}` - Facebook page URL
  - `{{TWITTER_URL}}` - Twitter profile URL
  - `{{INSTAGRAM_URL}}` - Instagram profile URL

### 2. OTP Template
- **File**: `templates/otp.html`
- **Purpose**: Sent for two-factor authentication
- **Variables**:
  - `{{LOGO_URL}}` - Company logo URL
  - `{{USER_NAME}}` - Recipient's name
  - `{{WEBSITE_NAME}}` - Website name
  - `{{OTP_CODE}}` - 6-digit verification code
  - `{{EXPIRY_TIME}}` - Time in minutes until code expires
  - `{{COMPANY_EMAIL}}` - Company email address
  - `{{COMPANY_PHONE}}` - Company phone number
  - `{{FACEBOOK_URL}}` - Facebook page URL
  - `{{TWITTER_URL}}` - Twitter profile URL
  - `{{INSTAGRAM_URL}}` - Instagram profile URL

### 3. Password Changed Template
- **File**: `templates/password-changed.html`
- **Purpose**: Confirmation email when password is changed
- **Variables**:
  - `{{LOGO_URL}}` - Company logo URL
  - `{{USER_NAME}}` - Recipient's name
  - `{{WEBSITE_NAME}}` - Website name
  - `{{CHANGE_DATETIME}}` - Date and time of password change
  - `{{COMPANY_EMAIL}}` - Company email address
  - `{{COMPANY_PHONE}}` - Company phone number
  - `{{FACEBOOK_URL}}` - Facebook page URL
  - `{{TWITTER_URL}}` - Twitter profile URL
  - `{{INSTAGRAM_URL}}` - Instagram profile URL
  - `{{SUPPORT_LINK}}` - Support page URL

## Admin Configuration

### Accessing Email Templates
1. Navigate to **WordPress Admin** → **Bema Hub** → **Email Templates**
2. Select the template tab you want to configure:
   - **General** - Shared settings for all templates
   - **Password Reset** - Specific settings for password reset template

### Configuration Fields

#### General Template Settings (Shared Across All Templates)
- **Logo URL**: URL to your company logo (recommended size: 200x60px)
- **Website Name**: Your website name
- **Company Email**: Contact email address
- **Company Phone**: Contact phone number
- **Facebook URL**: Link to your Facebook page
- **Twitter URL**: Link to your Twitter profile
- **Instagram URL**: Link to your Instagram profile

#### Password Reset Template Settings
- **Password Reset Page URL**: URL to your password reset page where users will enter their new password
- All other settings are shared from the General tab

## Password Reset Flow

### How It Works
1. User requests password reset via email
2. System generates a secure token and stores it with expiration (1 hour)
3. Email is sent with a reset link containing the token
4. User clicks the link and is directed to the password reset page
5. User enters new password and submits
6. System validates token and updates password

### Security Features
- **Secure Tokens**: Randomly generated 32-character tokens
- **Expiration**: Tokens expire after 1 hour
- **Single Use**: Tokens are invalidated after use
- **Rate Limiting**: Password reset requests are rate-limited (5 per 24 hours)

## Implementation Details

### Template Loading
The system uses a template loading mechanism:
1. Templates are stored in the `templates/` directory
2. Templates are loaded using the `load_email_template()` method
3. Placeholders are replaced with actual values from admin settings
4. If template loading fails, the system falls back to plain text emails

### Template Variables
Template variables are replaced using simple string replacement:
```php
$template = str_replace('{{' . $placeholder . '}}', $value, $template);
```

### Email Sending
Emails are sent using WordPress's `wp_mail()` function with HTML content type headers:
```php
$headers = array('Content-Type: text/html; charset=UTF-8');
wp_mail($to_email, $subject, $message, $headers);
```

### Password Reset Token Management
```php
// Generate token
$reset_token = wp_generate_password(32, false);

// Store token with expiration
update_user_meta($user_id, 'bema_password_reset_token', $reset_token);
update_user_meta($user_id, 'bema_password_reset_token_expiry', time() + 3600);

// Generate reset link
$reset_link = add_query_arg(array('token' => $reset_token, 'user_id' => $user_id), $reset_page_url);
```

## Customization

### Adding New Templates
To add a new email template:
1. Create a new HTML file in the `templates/` directory
2. Add placeholder variables using the `{{VARIABLE_NAME}}` format
3. Update the admin settings class to include configuration fields
4. Modify the mailer class to load and use the new template

### Modifying Existing Templates
To modify existing templates:
1. Edit the HTML files in the `templates/` directory
2. Maintain the placeholder variables for dynamic content
3. Test the changes by sending a test email

## Best Practices

### Template Design
1. Use responsive design for mobile compatibility
2. Keep templates simple and focused
3. Use consistent branding elements
4. Ensure good contrast for readability
5. Test templates across different email clients

### Security
1. Validate all user input
2. Sanitize template variables before replacement
3. Use HTTPS for all external resources
4. Regularly update template files
5. Implement proper token expiration and validation

### Performance
1. Optimize images for web use
2. Minimize CSS in templates
3. Cache template content when possible
4. Monitor email sending performance

## Troubleshooting

### Template Not Loading
- Check that template files exist in the `templates/` directory
- Verify file permissions
- Check PHP error logs for file access issues

### Variables Not Replaced
- Ensure placeholders use the correct `{{VARIABLE_NAME}}` format
- Check that variables are properly passed to the template loader
- Verify that admin settings contain the required values

### Email Formatting Issues
- Test with different email clients
- Check that HTML content type headers are set correctly
- Validate HTML syntax in templates

### Password Reset Issues
- Verify that the password reset page URL is correctly configured
- Check that tokens are being generated and stored properly
- Ensure token validation is working correctly