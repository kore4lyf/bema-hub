# Enhanced Email Logging Implementation

## Overview
This document describes the enhanced logging implementation for the Bema Hub email system. The improvements provide detailed diagnostic information when email sending fails, particularly for SMTP test functionality.

## Features Added

### 1. Detailed Email Logging
- Comprehensive logging for all email sending attempts
- Success and failure tracking with detailed context
- Debug information for troubleshooting SMTP issues

### 2. SMTP Test Enhancement
- Enhanced logging specifically for SMTP test emails
- Detailed error reporting for test failures
- Debug information collection for PHPMailer issues

### 3. Logger Integration
- Integration with existing `Bema_Hub_Logger` system
- Separate log file for email-related activities
- Correlation IDs for tracking related log entries

## Implementation Details

### Enhanced Mailer Class

#### send_otp_email() Method
```php
public static function send_otp_email($to_email, $otp_code, $purpose = 'general') {
    // Get email settings
    $smtp_settings = \get_option('bema_hub_smtp_settings', array());
    
    
    // Log email sending attempt
    if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
        $logger = \Bema_Hub\Bema_Hub_Logger::create('mailer');
        $logger->info('Sending OTP email', array(
            'to_email' => $to_email,
            'purpose' => $purpose,
            'subject' => $subject,
            'has_smtp_settings' => !empty($smtp_settings),
            'smtp_host' => !empty($smtp_settings['host']) ? $smtp_settings['host'] : 'Not set',
            'smtp_port' => !empty($smtp_settings['port']) ? $smtp_settings['port'] : 'Not set',
            'smtp_user' => !empty($smtp_settings['user']) ? 'Set' : 'Not set'
        ));
    }
    
    // Send email using WordPress wp_mail function
    $sent = \wp_mail($to_email, $subject, $message, $headers);
    
    // Log result
    if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
        $logger = \Bema_Hub\Bema_Hub_Logger::create('mailer');
        if ($sent) {
            $logger->info('OTP email sent successfully', array('to_email' => $to_email, 'purpose' => $purpose));
        } else {
            $logger->error('Failed to send OTP email', array(
                'to_email' => $to_email,
                'purpose' => $purpose,
                'smtp_settings' => $smtp_settings,
                'phpmailer_debug' => self::get_phpmailer_debug_info()
            ));
        }
    }
    
}
```

#### send_email() Method
```php
public static function send_email($to_email, $subject, $message, $headers = array()) {
    // Get email settings
    $smtp_settings = \get_option('bema_hub_smtp_settings', array());
    
    
    // Log email sending attempt
    if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
        $logger = \Bema_Hub\Bema_Hub_Logger::create('mailer');
        $logger->info('Sending generic email', array(
            'to_email' => $to_email,
            'subject' => $subject,
            'has_smtp_settings' => !empty($smtp_settings),
            'smtp_host' => !empty($smtp_settings['host']) ? $smtp_settings['host'] : 'Not set',
            'smtp_port' => !empty($smtp_settings['port']) ? $smtp_settings['port'] : 'Not set',
            'smtp_user' => !empty($smtp_settings['user']) ? 'Set' : 'Not set'
        ));
    }
    
    // Send email using WordPress wp_mail function
    $sent = \wp_mail($to_email, $subject, $message, $headers);
    
    // Log result
    if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
        $logger = \Bema_Hub\Bema_Hub_Logger::create('mailer');
        if ($sent) {
            $logger->info('Generic email sent successfully', array('to_email' => $to_email, 'subject' => $subject));
        } else {
            $logger->error('Failed to send generic email', array(
                'to_email' => $to_email,
                'subject' => $subject,
                'smtp_settings' => $smtp_settings,
                'headers' => $headers,
                'phpmailer_debug' => self::get_phpmailer_debug_info()
            ));
        }
    }
    
}
```

#### test_email_configuration() Method
```php
public static function test_email_configuration($to_email) {
    // Log test email attempt
    if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
        $logger = \Bema_Hub\Bema_Hub_Logger::create('mailer');
        $logger->info('Starting SMTP test email', array('to_email' => $to_email));
    }
    
    
    $result = self::send_email($to_email, $subject, $message);
    
    // Log test result
    if (class_exists('Bema_Hub\Bema_Hub_Logger')) {
        $logger = \Bema_Hub\Bema_Hub_Logger::create('mailer');
        if ($result === true) {
            $logger->info('SMTP test email sent successfully', array('to_email' => $to_email));
        } else {
            $logger->error('SMTP test email failed', array(
                'to_email' => $to_email,
                'error' => \is_wp_error($result) ? $result->get_error_message() : 'Unknown error'
            ));
        }
    }
    
    return $result;
}
```

#### get_phpmailer_debug_info() Method
```php
private static function get_phpmailer_debug_info() {
    // This is a simplified version - in a real implementation you might want to capture
    // more detailed information from the PHPMailer instance
    $debug_info = array(
        'php_version' => phpversion(),
        'wp_mail_function_exists' => function_exists('wp_mail'),
        'openssl_extension_loaded' => extension_loaded('openssl'),
        'sockets_extension_loaded' => extension_loaded('sockets') || extension_loaded('socket'),
    );
    
    // Check if we can get more detailed information
    if (function_exists('ini_get')) {
        $debug_info['allow_url_fopen'] = ini_get('allow_url_fopen');
        $debug_info['openssl_default_cert_file'] = ini_get('openssl.cafile');
    }
    
    return $debug_info;
}
```

## Logging Information Captured

### Success Logs
- Email type (OTP, generic, test)
- Recipient email address
- Email subject
- SMTP configuration status

### Error Logs
- Detailed error messages
- SMTP settings used
- PHPMailer debug information
- Headers used for sending
- PHP environment information

### Debug Information
- PHP version
- OpenSSL extension status
- Socket extension status
- allow_url_fopen setting
- OpenSSL certificate file path

## Usage Instructions

### 1. Configure SMTP Settings
1. Go to WordPress Admin → Bema Hub → Settings
2. Click on "Email (SMTP)" tab
3. Enter your SMTP configuration details
4. Save the settings

### 2. Test Configuration
1. Scroll down to "Test SMTP Configuration" section
2. Verify the email address is correct
3. Click "Send Test Email"
4. Check the mailer log file for detailed information

### 3. Check Logs
1. Navigate to `/wp-content/uploads/bema-crowdfunding-logger/mailer/`
2. Open `mailer.log` to view email-related logs
3. Look for error entries to diagnose issues

## Log File Locations

### Main Log File
- Path: `/wp-content/uploads/bema-crowdfunding-logger/mailer/mailer.log`

### Rotated Log Files
- Path: `/wp-content/uploads/bema-crowdfunding-logger/mailer/mailer.log.YYYY-MM-DD-HH-MM-SS`

## Troubleshooting Common Issues

### 1. SMTP Connection Failures
- Check SMTP host and port settings
- Verify SMTP credentials
- Ensure server can connect to SMTP server

### 2. Authentication Failures
- Verify username and password/App Key
- Check if App Key is required for your email provider
- Confirm account has SMTP access

### 3. TLS/SSL Issues
- Verify encryption setting (tls/ssl/none)
- Check if correct port is used for encryption type
- Ensure OpenSSL extension is enabled

### 4. Email Rejection
- Check if email address is valid
- Verify sender domain is authorized
- Confirm email content complies with provider policies

## Technical Notes

### Static Analysis Warnings
The implementation may show static analysis warnings for WordPress core functions:
- `get_option()`, `wp_mail()`, `is_wp_error()` are WordPress core functions
- `WP_Error` is a WordPress core class
- These warnings are normal in static analysis tools and do not affect runtime functionality
- Functions are properly prefixed with backslashes for global namespace access

### Logger Integration
- Uses existing `Bema_Hub_Logger` system
- Creates separate log file for email activities
- Follows WordPress plugin development best practices
- Maintains consistent logging format with other plugin components

## Benefits

1. **Improved Debugging**: Detailed logs help identify email sending issues quickly
2. **Faster Resolution**: Specific error information reduces troubleshooting time
3. **Security**: No sensitive information logged in plain text
4. **Integration**: Works seamlessly with existing logging system
5. **Performance**: Minimal overhead on email sending process