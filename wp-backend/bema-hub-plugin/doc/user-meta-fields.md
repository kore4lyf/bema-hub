# User Meta Fields Documentation

This document describes all the custom user meta fields used in the Bema Hub plugin.

## Table of Contents

1. [Required Fields](#required-fields)
2. [Optional Fields](#optional-fields)
3. [System Fields](#system-fields)
4. [Social Login Fields](#social-login-fields)
5. [Security Fields](#security-fields)
6. [Verification Fields](#verification-fields)
7. [Implementation Details](#implementation-details)

## Required Fields

These fields are required for all users during registration.

### bema_first_name
- **Type**: String
- **Description**: User's first name
- **Required**: Yes
- **Encrypted**: No
- **Default**: None

### bema_last_name
- **Type**: String
- **Description**: User's last name
- **Required**: Yes
- **Encrypted**: No
- **Default**: None

### bema_country
- **Type**: String
- **Description**: User's country
- **Required**: Yes
- **Encrypted**: No
- **Default**: None

## Optional Fields

These fields are optional but can be provided during registration.

### bema_phone_number
- **Type**: String
- **Description**: User's phone number
- **Required**: No (Required for email signup, optional for social)
- **Encrypted**: Yes (Base64 encoded as placeholder)
- **Default**: None

### bema_city
- **Type**: String
- **Description**: User's city
- **Required**: No
- **Encrypted**: No
- **Default**: None

### bema_referred_by
- **Type**: String
- **Description**: Referral code
- **Required**: No
- **Encrypted**: No
- **Default**: None

## System Fields

These fields are automatically managed by the system.

### bema_device_id
- **Type**: String
- **Description**: Auto-generated device ID for fraud detection
- **Required**: Yes (auto-generated)
- **Encrypted**: No
- **Default**: Auto-generated via `uniqid('device_', true)`

### bema_tier_level
- **Type**: Enum (Opt-In, Gold, VIP)
- **Description**: User's tier level
- **Required**: Yes (auto-set)
- **Encrypted**: No
- **Default**: Opt-In

### bema_account_type
- **Type**: Enum (subscriber, admin)
- **Description**: User's account type
- **Required**: Yes (auto-set)
- **Encrypted**: No
- **Default**: subscriber

### bema_last_signin
- **Type**: Timestamp
- **Description**: Timestamp of last signin
- **Required**: Yes (auto-set)
- **Encrypted**: No
- **Default**: Current timestamp (updated on each login)

## Social Login Fields

These fields store OAuth IDs for social login providers.

### bema_google_id
- **Type**: String
- **Description**: Google OAuth ID
- **Required**: No
- **Encrypted**: No
- **Default**: None

### bema_facebook_id
- **Type**: String
- **Description**: Facebook OAuth ID
- **Required**: No
- **Encrypted**: No
- **Default**: None

### bema_x_id
- **Type**: String
- **Description**: X/Twitter OAuth ID
- **Required**: No
- **Encrypted**: No
- **Default**: None

## Security Fields

These fields are used for security purposes.

### bema_fraud_flag
- **Type**: Boolean
- **Description**: Flag for suspicious activity
- **Required**: Yes (auto-set)
- **Encrypted**: No
- **Default**: false

## Verification Fields

These fields track user verification status.

### bema_email_verified
- **Type**: Boolean
- **Description**: Email verification status
- **Required**: Yes (auto-set)
- **Encrypted**: No
- **Default**: false (true for social login users)

### bema_phone_verified
- **Type**: Boolean
- **Description**: Phone verification status
- **Required**: Yes (auto-set)
- **Encrypted**: No
- **Default**: false (true if phone number provided during social login)

### bema_otp_code
- **Type**: String
- **Description**: Hashed OTP code for email verification
- **Required**: Yes (during email signup)
- **Encrypted**: Yes (hashed with `wp_hash_password`)
- **Default**: None

### bema_otp_expiry
- **Type**: Timestamp
- **Description**: OTP code expiration timestamp
- **Required**: Yes (during email signup)
- **Encrypted**: No
- **Default**: None

## Implementation Details

### Field Creation
User meta fields are created during the user registration process in the following methods:
- `signup()` method in `Bema_Hub_REST_API` class
- `social_login()` method in `Bema_Hub_REST_API` class

### Field Encryption
Sensitive fields like phone numbers are encrypted using base64 encoding as a placeholder. In a production environment, a proper encryption library should be used.

### Field Validation
All fields are validated during registration:
- Required fields are checked for presence
- Email format is validated
- Phone numbers are optionally validated
- Country is validated against a dropdown selection

### Field Updates
Fields are updated automatically during various operations:
- `bema_last_signin` is updated on each login
- `bema_email_verified` is set to true after OTP verification
- `bema_phone_verified` is set to true when a phone number is provided
- Social login fields are set when linking social accounts

### Field Retrieval
Fields can be retrieved using WordPress's `get_user_meta()` function:
```php
$first_name = get_user_meta($user_id, 'bema_first_name', true);
$phone_number = get_user_meta($user_id, 'bema_phone_number', true);
$email_verified = get_user_meta($user_id, 'bema_email_verified', true);
```

### Field Deletion
OTP fields are deleted after successful verification:
```php
delete_user_meta($user_id, 'bema_otp_code');
delete_user_meta($user_id, 'bema_otp_expiry');
```

## Best Practices

1. **Data Privacy**: Always encrypt sensitive information like phone numbers
2. **Validation**: Validate all user input before storing
3. **Defaults**: Set appropriate default values for system fields
4. **Cleanup**: Remove temporary fields (like OTP) after use
5. **Security**: Use WordPress functions for hashing and validation
6. **Consistency**: Use consistent naming conventions (bema_ prefix)
7. **Documentation**: Keep this document updated with any field changes