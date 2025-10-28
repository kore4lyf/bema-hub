# Bema Hub User Meta Fields

This document describes all custom user meta fields used in the Bema Hub plugin. All custom fields are prefixed with `bema_` to avoid conflicts with WordPress core fields and other plugins.

## Table of Contents
- [Bema Hub User Meta Fields](#bema-hub-user-meta-fields)
  - [Table of Contents](#table-of-contents)
  - [User Information Fields](#user-information-fields)
  - [Verification and Security Fields](#verification-and-security-fields)
  - [Social Authentication Fields](#social-authentication-fields)
  - [System and Tracking Fields](#system-and-tracking-fields)
  - [Implementation Notes](#implementation-notes)
    - [Data Types](#data-types)
    - [Encryption](#encryption)
    - [OTP System](#otp-system)
    - [Immutable Fields](#immutable-fields)
    - [Email Verification Status](#email-verification-status)

## User Information Fields

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| bema_phone_number | String | No | Encrypted phone number for user contact. Stored as base64 encoded string. |
| bema_country | String | Yes | User's country of residence. Required during signup. |
| bema_state | String | No | User's state or region within their country. |
| bema_referred_by | String | No | Referral code from another user. Only set during signup, cannot be updated. |
| bema_tier_level | String | No | User's membership tier level. Default value is "Opt-In". |

## Verification and Security Fields

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| bema_email_verified | Boolean | No | Email verification status. True if user has verified their email address. Always returned as a boolean value. |
| bema_phone_verified | Boolean | No | Phone number verification status. True if user has verified their phone number. |
| bema_otp_code | String | No | SHA256 hashed OTP code for all OTP verification purposes (email, phone, password reset). |
| bema_otp_expiry | Integer | No | Unix timestamp indicating when the current OTP expires. |
| bema_otp_purpose | String | No | Purpose of the current OTP ("email_verification", "phone_verification", or "password_reset"). |
| bema_fraud_flag | Boolean | No | Fraud detection flag. True if suspicious activity is detected on the account. |
| bema_account_type | String | No | User's account type classification. Default value is "subscriber". |

## Social Authentication Fields

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| bema_google_id | String | No | Google user ID for social login integration. |
| bema_facebook_id | String | No | Facebook user ID for social login integration. |
| bema_twitter_id | String | No | Twitter user ID for social login integration. |

## System and Tracking Fields

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| bema_device_id | String | No | Unique device identifier for the user's current device. |
| bema_last_signin | Integer | No | Unix timestamp of the user's last successful signin. |
| bema_last_signout | Integer | No | Unix timestamp of the user's last signout. |

## Implementation Notes

### Data Types
- **String**: Text data stored as WordPress meta values
- **Boolean**: Stored as WordPress meta values (1 for true, 0 for false) but always returned as boolean in API responses
- **Integer**: Numeric values stored as WordPress meta values
- **Array**: Not directly stored as meta fields but retrieved from WordPress user objects (e.g., roles)

### Encryption
- Phone numbers are base64 encoded before storage as a basic obfuscation method
- In a production environment, proper encryption should be implemented

### OTP System
- Uses a shared OTP field system with a purpose tracker to distinguish between different verification types
- OTP codes are hashed using SHA256 before storage
- OTP expiration is set to 10 minutes (600 seconds) for all verification types

### Immutable Fields
- `bema_referred_by`: Can only be set during user signup and cannot be updated afterward
- `roles`: WordPress user roles are managed by WordPress core and retrieved from user objects, not stored as meta fields

### Email Verification Status
The `bema_email_verified` field is consistently returned as a boolean value in all API responses:
- **True**: Email has been verified through OTP process
- **False**: Email has not been verified
- This field is automatically set to `false` for new email signup users
- This field is automatically set to `true` for social login users
- The field is always cast to boolean when retrieved to ensure consistent API responses
