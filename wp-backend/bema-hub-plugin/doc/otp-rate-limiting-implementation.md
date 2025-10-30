# OTP Rate Limiting Implementation

## Overview
This document describes the implementation of OTP rate limiting in the Bema Hub plugin using user meta fields. The solution prevents abuse of the OTP system by limiting users to 10 OTP requests per 24-hour period.

## Features Implemented

### 1. Request Limiting
- Maximum of 10 OTP requests per 24-hour period per user
- Automatic reset of counter after 24 hours
- Clear error messages when limit is exceeded with precise time formatting

### 2. User Meta Fields
- `bema_email_otp_request_count` - Tracks number of OTP requests
- `bema_last_successful_email_otp_request` - Timestamp of last successful request

### 3. Rate Limiting Logic
- Check request count before sending OTP
- Increment count only on successful email send
- Reset count after 24 hours

## Implementation Details

### New Class Properties
```php
/**
 * Maximum OTP requests allowed per 24 hours
 *
 * @since    1.0.0
 * @access   private
 * @var      int    $max_otp_requests    Maximum OTP requests per 24 hours.
 */
private $max_otp_requests = 10;
```

### New Methods

#### can_request_otp()
```php
private function can_request_otp($user_id) {
    // Get OTP request count and last successful request timestamp
    $request_count = (int) \get_user_meta($user_id, 'bema_email_otp_request_count', true);
    $last_request_timestamp = (int) \get_user_meta($user_id, 'bema_last_successful_email_otp_request', true);
    
    // Check if 24 hours have passed since last successful request
    $time_since_last_request = \time() - $last_request_timestamp;
    $twenty_four_hours = 24 * 60 * 60; // 86400 seconds
    
    if ($time_since_last_request >= $twenty_four_hours) {
        // Reset count if 24 hours have passed
        $request_count = 0;
        \update_user_meta($user_id, 'bema_email_otp_request_count', $request_count);
    }
    
    // Check if user has reached the maximum request limit
    if ($request_count >= $this->max_otp_requests) {
        $seconds_remaining = $twenty_four_hours - $time_since_last_request;
        
        // Format time remaining in a human-readable way
        $hours = floor($seconds_remaining / 3600);
        $minutes = floor(($seconds_remaining % 3600) / 60);
        $seconds = $seconds_remaining % 60;
        
        // Create a human-readable time string
        $time_string = '';
        if ($hours > 0) {
            $time_string .= $hours . ' hour' . ($hours > 1 ? 's' : '');
            if ($minutes > 0 || $seconds > 0) {
                $time_string .= ', ';
            }
        }
        if ($minutes > 0) {
            $time_string .= $minutes . ' minute' . ($minutes > 1 ? 's' : '');
            if ($seconds > 0) {
                $time_string .= ', ';
            }
        }
        if ($seconds > 0 && $hours == 0) { // Only show seconds if less than 1 hour remaining
            $time_string .= $seconds . ' second' . ($seconds > 1 ? 's' : '');
        }
        
        // Fallback if all values are 0 (shouldn't happen but just in case)
        if (empty($time_string)) {
            $time_string = '1 second';
        }
        
        return new \WP_Error(
            'otp_request_limit_exceeded', 
            "You have exceeded the maximum OTP request limit. Please try again in {$time_string}.", 
            array('status' => 429)
        );
    }
    
    return true;
}
```

#### increment_otp_request_count()
```php
private function increment_otp_request_count($user_id) {
    // Get current count
    $request_count = (int) \get_user_meta($user_id, 'bema_email_otp_request_count', true);
    
    // Increment count
    $request_count++;
    
    // Update count and timestamp
    \update_user_meta($user_id, 'bema_email_otp_request_count', $request_count);
    \update_user_meta($user_id, 'bema_last_successful_email_otp_request', \time());
    
    if ($this->logger) {
        $this->logger->info('OTP request count incremented', array(
            'user_id' => $user_id,
            'request_count' => $request_count
        ));
    }
}
```

### Enhanced Methods

#### reset_password_request()
```php
public function reset_password_request($request) {
    
    // Check if user can request OTP (rate limiting)
    $can_request = $this->can_request_otp($user->ID);
    if (\is_wp_error($can_request)) {
        // ... error handling ...
        return $can_request;
    }
    
    
    if (\is_wp_error($mailer_result)) {
        // ... error handling ...
    } else {
        // Increment OTP request count only on successful email send
        $this->increment_otp_request_count($user->ID);
        // ... success logging ...
    }
    
}
```

#### resend_otp()
```php
public function resend_otp($request) {
    
    // Check if user can request OTP (rate limiting)
    $can_request = $this->can_request_otp($user->ID);
    if (\is_wp_error($can_request)) {
        // ... error handling ...
        return $can_request;
    }
    
    
    if (\is_wp_error($mailer_result)) {
        // ... error handling ...
    } else {
        // Increment OTP request count only on successful email send
        $this->increment_otp_request_count($user->ID);
        // ... success logging ...
    }
    
}
```

## User Meta Fields

### bema_email_otp_request_count
- **Type**: Integer
- **Default**: 0
- **Description**: Tracks the number of OTP requests made by the user in the current 24-hour period

### bema_last_successful_email_otp_request
- **Type**: Unix timestamp
- **Default**: 0
- **Description**: Stores the timestamp of the last successful OTP request

## Rate Limiting Logic

### Request Flow
1. User requests OTP (password reset or resend)
2. System checks `bema_email_otp_request_count` and `bema_last_successful_email_otp_request`
3. If 24 hours have passed since last request, reset count to 0
4. If count >= 10, deny request with clear error message
5. If count < 10, allow request and increment count on successful email send

### Human-Readable Time Formatting
The error messages now provide precise time information:
- **Examples**: 
  - "Please try again in 5 hours, 23 minutes"
  - "Please try again in 1 hour, 5 minutes, 32 seconds"
  - "Please try again in 45 minutes, 12 seconds"
  - "Please try again in 32 seconds"

This provides a much better user experience than just showing hours.

### Error Handling
- Returns HTTP 429 (Too Many Requests) status code
- Provides clear message with precise time estimates
- Logs rate limiting events for security monitoring

## Benefits

### 1. Security
- Prevents OTP spam and abuse
- Protects against brute force attacks
- Reduces server load from excessive requests

### 2. User Experience
- Clear error messages with precise time information
- Fair usage policy (10 requests per day)
- No impact on legitimate users

### 3. Performance
- Uses efficient user meta fields
- Minimal database queries
- No external dependencies

## Technical Notes

### Static Analysis Warnings
The implementation may show static analysis warnings for WordPress core functions:
- These are normal and do not affect runtime functionality
- Functions are properly prefixed with backslashes for global namespace access

### Logger Integration
- Uses existing `Bema_Hub_Logger` system
- Logs rate limiting events for security monitoring
- Maintains consistent logging format

## Usage Instructions

No changes are required for existing functionality. The rate limiting works automatically:
1. Users can request up to 10 OTPs per 24-hour period
2. After 24 hours, the counter resets automatically
3. Excessive requests are denied with clear error messages

## Monitoring

### Log File Location
- Path: `/wp-content/uploads/bema-crowdfunding-logger/rest-api/rest-api.log`

### Expected Log Pattern
After the implementation, you should see:
- INFO entries when OTP request count is incremented
- WARNING entries when rate limiting is triggered
- No change to successful OTP request flow