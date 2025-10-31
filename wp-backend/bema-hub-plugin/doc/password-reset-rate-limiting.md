# Password Reset Rate Limiting Implementation

## Overview
This document describes the implementation of rate limiting for password reset requests in the Bema Hub plugin. The implementation uses WordPress user meta fields to track request counts and implements a configurable daily limit that can be adjusted in the admin settings.

## Implementation Details

### 1. User Meta Fields
Two new user meta fields are used to track password reset requests:
- `bema_password_reset_request_count`: Tracks the number of password reset requests made by a user in the current 24-hour period
- `bema_last_password_reset_request`: Stores the timestamp of the last successful password reset request

### 2. Rate Limiting Logic
The rate limiting logic works as follows:
1. When a password reset request is made, the system checks the user's request count and last request timestamp
2. If 24 hours have passed since the last request, the count is reset to 0
3. If the user has reached the maximum allowed requests (default 5), an error is returned with a human-readable time remaining message
4. If the user is under the limit, the request is processed and the count is incremented

### 3. Configurable Limits
The password reset limit is configurable through the admin settings:
- Default limit: 5 requests per 24 hours
- Can be adjusted in the OTP Settings admin page
- Separate from the general OTP request limit

### 4. Admin Settings
A new field has been added to the OTP Settings page:
- "Daily Password Reset Limit": Controls the maximum number of password reset requests allowed per 24 hours per user

## Code Changes

### 1. Admin Settings (class-bema-hub-otp-settings.php)
- Added new setting field `password_reset_daily_limit`
- Default value set to 5
- Added description for the new field

### 2. OTP Controller (class-bema-hub-otp-controller.php)
- Added `$max_password_reset_requests` property with default value of 5
- Added `can_request_password_reset()` method to check rate limiting
- Added `increment_password_reset_request_count()` method to update counters
- Modified `reset_password_request()` method to use password reset specific rate limiting

## Error Handling
When a user exceeds the password reset limit, they receive a 429 (Too Many Requests) error with a message like:
"You have exceeded the maximum password reset request limit. Please try again in X hours, Y minutes."

The time remaining is formatted in a human-readable way, showing hours, minutes, and seconds as appropriate.