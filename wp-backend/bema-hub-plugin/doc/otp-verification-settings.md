# OTP Verification Settings

## Overview
This document describes the OTP (One-Time Password) verification settings implementation for the Bema Hub WordPress plugin. The settings allow administrators to configure various aspects of the OTP verification process through a dedicated admin interface.

## Admin Interface

The OTP verification settings are accessible through the WordPress admin dashboard under the "Bema Hub" menu. The interface includes three tabs:

1. **General** - General plugin settings
2. **Email (SMTP)** - SMTP email configuration
3. **OTP Settings** - OTP verification configuration

## OTP Settings Configuration

The OTP Settings tab includes the following configurable options:

### 1. OTP Expiry Time (minutes)
- **Description**: Time in minutes before an OTP expires
- **Default Value**: 10 minutes
- **Valid Range**: 1-60 minutes
- **Usage**: Controls how long an OTP remains valid after generation

### 2. OTP Length
- **Description**: Number of digits in the OTP
- **Default Value**: 6 digits
- **Valid Range**: 4-10 digits
- **Usage**: Determines the complexity of the OTP (longer = more secure)

### 3. Max Verification Attempts
- **Description**: Maximum number of verification attempts before locking
- **Default Value**: 3 attempts
- **Valid Range**: 1-10 attempts
- **Usage**: Prevents brute force attacks by limiting verification attempts

### 4. Resend Delay (seconds)
- **Description**: Delay in seconds before a user can request a new OTP
- **Default Value**: 60 seconds
- **Valid Range**: 0-300 seconds
- **Usage**: Prevents abuse by limiting how frequently OTPs can be resent

## Implementation Details

### Settings Storage
All OTP settings are stored in the WordPress options table with the key `bema_hub_otp_settings` as a serialized array.

### Default Values
If no settings are configured, the system uses the following defaults:
- Expiry Time: 10 minutes
- OTP Length: 6 digits
- Max Attempts: 3 attempts
- Resend Delay: 60 seconds

### Retrieval in Code
To retrieve OTP settings in your code:

```php
$otp_settings = get_option('bema_hub_otp_settings', array());

// Access individual settings with defaults
$expiry_time = isset($otp_settings['expiry_time']) ? intval($otp_settings['expiry_time']) : 10;
$otp_length = isset($otp_settings['length']) ? intval($otp_settings['length']) : 6;
$max_attempts = isset($otp_settings['max_attempts']) ? intval($otp_settings['max_attempts']) : 3;
$resend_delay = isset($otp_settings['resend_delay']) ? intval($otp_settings['resend_delay']) : 60;
```

## Security Considerations

1. **OTP Expiry**: Short expiry times reduce the window of opportunity for attackers
2. **Attempt Limiting**: Limiting verification attempts prevents brute force attacks
3. **Resend Throttling**: Delaying resend requests prevents spam and abuse
4. **OTP Length**: Longer OTPs are more secure but may be harder for users to enter

## Usage Examples

### Generating an OTP with Configurable Length
```php
$otp_settings = get_option('bema_hub_otp_settings', array());
$otp_length = isset($otp_settings['length']) ? intval($otp_settings['length']) : 6;

// Generate OTP with configured length
$otp_code = rand(pow(10, $otp_length-1), pow(10, $otp_length)-1);
```

### Setting OTP Expiry with Configurable Time
```php
$otp_settings = get_option('bema_hub_otp_settings', array());
$expiry_time = isset($otp_settings['expiry_time']) ? intval($otp_settings['expiry_time']) : 10;

// Set expiry timestamp
$otp_expiry = time() + ($expiry_time * 60); // Convert minutes to seconds
```

### Checking Verification Attempts
```php
$otp_settings = get_option('bema_hub_otp_settings', array());
$max_attempts = isset($otp_settings['max_attempts']) ? intval($otp_settings['max_attempts']) : 3;

// Check if user has exceeded maximum attempts
if ($verification_attempts >= $max_attempts) {
    // Lock the user or implement other security measures
}
```

### Implementing Resend Delay
```php
$otp_settings = get_option('bema_hub_otp_settings', array());
$resend_delay = isset($otp_settings['resend_delay']) ? intval($otp_settings['resend_delay']) : 60;

// Check if enough time has passed since last OTP request
$last_request_time = get_user_meta($user_id, 'bema_last_otp_request', true);
if (time() - $last_request_time < $resend_delay) {
    // Return error: not enough time has passed
}
```

## Best Practices

1. **Regular Review**: Periodically review OTP settings to ensure they meet current security requirements
2. **User Experience**: Balance security with usability - overly restrictive settings may frustrate legitimate users
3. **Testing**: Test different configurations to find the optimal balance for your use case
4. **Monitoring**: Monitor OTP verification logs for suspicious activity

## Troubleshooting

### OTP Not Expiring
- Verify the expiry time setting is correctly configured
- Check server time synchronization
- Ensure the OTP validation code correctly compares timestamps

### Too Many Verification Attempts
- Check if the attempt counter is being properly incremented
- Verify the max attempts setting is being read correctly
- Review logs for potential abuse patterns

### Resend Requests Being Blocked
- Verify the resend delay setting is appropriate for your use case
- Check if the last request time is being stored correctly
- Ensure server time is accurate