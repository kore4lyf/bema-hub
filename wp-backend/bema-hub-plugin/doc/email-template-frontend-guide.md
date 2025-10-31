# Email Template System - Frontend Integration Guide

## Overview
This guide provides frontend developers with information about the email template system in the Bema Hub plugin. While frontend developers typically don't directly interact with email templates, understanding the system helps when implementing features that trigger email sending.

## When Emails Are Sent

### 1. Password Reset Request
- **Trigger**: User submits email on password reset form
- **Endpoint**: `POST /wp-json/bema-hub/v1/reset-password-request`
- **Template Used**: Password Reset Template
- **Variables Populated**:
  - `{{USER_NAME}}` - User's display name
  - `{{RESET_LINK}}` - Secure password reset link with token
  - Shared variables from admin settings:
    - `{{LOGO_URL}}` - Company logo
    - `{{WEBSITE_NAME}}` - Website name
    - `{{COMPANY_EMAIL}}` - Company email
    - `{{COMPANY_PHONE}}` - Company phone
    - `{{FACEBOOK_URL}}` - Facebook page
    - `{{TWITTER_URL}}` - Twitter profile
    - `{{INSTAGRAM_URL}}` - Instagram profile

### 2. OTP Resend
- **Trigger**: User requests to resend OTP code
- **Endpoint**: `POST /wp-json/bema-hub/v1/resend-otp`
- **Template Used**: OTP Template
- **Variables Populated**:
  - `{{USER_NAME}}` - User's display name
  - `{{OTP_CODE}}` - 6-digit verification code
  - Shared variables from admin settings:
    - `{{LOGO_URL}}` - Company logo
    - `{{WEBSITE_NAME}}` - Website name
    - `{{COMPANY_EMAIL}}` - Company email
    - `{{COMPANY_PHONE}}` - Company phone
    - `{{FACEBOOK_URL}}` - Facebook page
    - `{{TWITTER_URL}}` - Twitter profile
    - `{{INSTAGRAM_URL}}` - Instagram profile

## Password Reset Flow

### How It Works for Users
1. User enters their email on the password reset page
2. System sends an email with a "Reset Password" button
3. User clicks the button and is directed to the password reset page
4. User enters their new password and confirms it
5. System updates the password and logs the user in

### Key Points for Frontend Developers
- Users don't need to know about OTP codes for password reset
- The email contains a direct link to reset the password
- The reset link includes a secure token for authentication
- Tokens expire after 1 hour for security
- Users should be redirected to login page after successful reset

### Password Reset Page Implementation
The password reset page should:
1. Accept a token and user_id parameter from the URL
2. Validate the token before showing the password reset form
3. Allow users to enter and confirm a new password
4. Submit the new password along with the token to the backend
5. Redirect users to login page after successful reset

Example URL: `https://yoursite.com/reset-password?token=abc123&user_id=456`

## API Response Considerations

### Success Responses
When email sending is successful, the API returns:
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset code has been sent."
}
```

### Error Responses
When email sending fails, the API returns:
```json
{
  "code": "email_send_failed",
  "message": "Failed to send email",
  "data": {
    "status": 500
  }
}
```

## User Experience Guidelines

### Loading States
When triggering email sending:
1. Show a loading spinner or progress indicator
2. Disable the submit button to prevent duplicate requests
3. Display success message when email is sent
4. Handle errors gracefully with user-friendly messages

### Example Implementation
```javascript
// Password reset request example
async function requestPasswordReset(email) {
  const submitButton = document.getElementById('reset-button');
  const loadingSpinner = document.getElementById('loading-spinner');
  const messageDiv = document.getElementById('message');
  
  // Show loading state
  submitButton.disabled = true;
  loadingSpinner.style.display = 'block';
  messageDiv.style.display = 'none';
  
  try {
    const response = await fetch('/wp-json/bema-hub/v1/reset-password-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Show success message
      messageDiv.className = 'success';
      messageDiv.textContent = data.message;
      messageDiv.style.display = 'block';
    } else {
      // Show error message
      messageDiv.className = 'error';
      messageDiv.textContent = 'Failed to send password reset email. Please try again.';
      messageDiv.style.display = 'block';
    }
  } catch (error) {
    // Handle network errors
    messageDiv.className = 'error';
    messageDiv.textContent = 'Network error. Please check your connection and try again.';
    messageDiv.style.display = 'block';
  } finally {
    // Reset loading state
    submitButton.disabled = false;
    loadingSpinner.style.display = 'none';
  }
}
```

## Email Delivery Considerations

### Delivery Time
- Emails are sent immediately when triggered
- Delivery time varies based on SMTP configuration
- Users should typically receive emails within seconds to minutes

### Spam Filters
- HTML emails may be filtered as spam
- Ensure proper SPF, DKIM, and DMARC records
- Use recognizable sender names and addresses

### Mobile Responsiveness
- All email templates are mobile-responsive
- Test email rendering on various devices
- Keep content concise for mobile users

## Testing Email Functionality

### Test Scenarios
1. **Password Reset Flow**:
   - Submit valid email address
   - Check that email is received
   - Verify email content and formatting
   - Test reset link functionality
   
2. **OTP Resend Flow**:
   - Request OTP resend
   - Check that email is received
   - Verify OTP code is correct

3. **Error Handling**:
   - Submit invalid email format
   - Check that appropriate error messages are shown
   - Verify no email is sent for invalid requests

### Admin Testing
Administrators can test email configuration:
1. Navigate to **Bema Hub** → **Email (SMTP)** → **Test SMTP Configuration**
2. Enter a test email address
3. Click "Send Test Email"
4. Check inbox for test message

## Template Customization (Admin Only)

### Accessing Templates
Administrators can customize email templates at:
**Bema Hub** → **Email Templates**

### Available Customizations
All templates share the same variables for consistent branding:
1. **Branding**:
   - Company logo (`{{LOGO_URL}}`)
   - Website name (`{{WEBSITE_NAME}}`)
   - Social media links:
     - Facebook (`{{FACEBOOK_URL}}`)
     - Twitter (`{{TWITTER_URL}}`)
     - Instagram (`{{INSTAGRAM_URL}}`)

2. **Contact Information**:
   - Email address (`{{COMPANY_EMAIL}}`)
   - Phone number (`{{COMPANY_PHONE}}`)

3. **Password Reset Specific**:
   - Reset page URL (admin setting, not template variable)

## Integration Points

### User Registration
While not currently implemented, future versions may include:
- Welcome emails for new users
- Email verification for new accounts

### Notifications
Potential future integrations:
- Activity notifications
- Security alerts
- System updates

## Best Practices

### User Feedback
1. Always provide clear feedback when emails are sent
2. Inform users about expected delivery time
3. Provide alternative contact methods for urgent issues

### Error Handling
1. Distinguish between user errors and system errors
2. Log system errors for administrator review
3. Provide actionable guidance for users

### Accessibility
1. Ensure emails are readable with screen readers
2. Use high contrast colors
3. Provide text alternatives for images

## Support and Troubleshooting

### Common Issues
1. **Emails not received**:
   - Check spam/junk folders
   - Verify email address is correct
   - Contact administrator to check SMTP settings

2. **Formatting issues**:
   - Some email clients may not support all HTML/CSS
   - Report rendering issues to administrators

3. **Delivery delays**:
   - Check SMTP server status
   - Review email server logs
   - Contact email service provider if needed

4. **Password reset link not working**:
   - Check that the password reset page URL is correctly configured
   - Verify token validation is working
   - Check token expiration settings

### Getting Help
For issues with email functionality:
1. Check the WordPress error logs
2. Contact the site administrator
3. Review SMTP configuration settings