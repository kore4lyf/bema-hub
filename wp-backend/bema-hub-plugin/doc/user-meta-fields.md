# User Meta Fields Documentation

This document describes all custom user meta fields used in the Bema Hub plugin. All fields use the `bema_` prefix to avoid conflicts with WordPress core fields and other plugins.

## Table of Contents
1. [User Profile Fields](#user-profile-fields)
2. [Authentication Fields](#authentication-fields)
3. [Social Login Fields](#social-login-fields)
4. [Verification Fields](#verification-fields)
5. [System Fields](#system-fields)
6. [Security Fields](#security-fields)
7. [Usage Guidelines](#usage-guidelines)

## User Profile Fields

### bema_phone_number
- **Description**: User's phone number
- **Type**: String (Encrypted)
- **Required**: No
- **Storage**: Encrypted (Base64 encoded in current implementation)
- **Example**: "UzJWbWMzQnBjeUF4TURB" (encrypted "+1234567890")

### bema_country
- **Description**: User's country
- **Type**: String
- **Required**: Yes (during registration)
- **Storage**: Plain text
- **Example**: "United States"

### bema_state
- **Description**: User's state
- **Type**: String
- **Required**: No
- **Storage**: Plain text
- **Example**: "New York"

### bema_referred_by
- **Description**: Referral code or user ID
- **Type**: String
- **Required**: No
- **Storage**: Plain text
- **Example**: "R-SOS2026-123"
- **Note**: This field is only set during signup and cannot be updated later

## Authentication Fields

### bema_tier_level
- **Description**: User's tier level in the system
- **Type**: String (Enum)
- **Required**: Yes (auto-set)
- **Storage**: Plain text
- **Possible Values**: "Opt-In", "Bronze", "Silver", "Gold", "Platinum"
- **Default**: "Opt-In"

### bema_account_type
- **Description**: Account type classification
- **Type**: String (Enum)
- **Required**: Yes (auto-set)
- **Storage**: Plain text
- **Possible Values**: "subscriber", "premium", "admin"
- **Default**: "subscriber"

## Social Login Fields

### bema_google_id
- **Description**: Google user ID for social login
- **Type**: String
- **Required**: No
- **Storage**: Plain text
- **Example**: "123456789012345678901"

### bema_facebook_id
- **Description**: Facebook user ID for social login
- **Type**: String
- **Required**: No
- **Storage**: Plain text
- **Example**: "1234567890123456"

### bema_twitter_id
- **Description**: Twitter user ID for social login
- **Type**: String
- **Required**: No
- **Storage**: Plain text
- **Example**: "123456789"

## Verification Fields

### bema_email_verified
- **Description**: Email verification status
- **Type**: Boolean
- **Required**: Yes (auto-set)
- **Storage**: Boolean (0 or 1)
- **Default**: false
- **Note**: Social login users are automatically verified

### bema_phone_verified
- **Description**: Phone verification status
- **Type**: Boolean
- **Required**: Yes (auto-set)
- **Storage**: Boolean (0 or 1)
- **Default**: false
- **Note**: Set to true if phone number is provided during social login

## System Fields

### bema_device_id
- **Description**: Unique device identifier
- **Type**: String
- **Required**: Yes (auto-generated)
- **Storage**: Plain text
- **Example**: "device_5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f"
- **Note**: Generated during user registration

### bema_last_signin
- **Description**: Last signin timestamp
- **Type**: Timestamp (Unix)
- **Required**: No (auto-updated)
- **Storage**: Integer
- **Example**: 1609459200

### bema_last_signout
- **Description**: Last signout timestamp
- **Type**: Timestamp (Unix)
- **Required**: No (auto-updated)
- **Storage**: Integer
- **Example**: 1609459200

## Security Fields

### bema_otp_code
- **Description**: SHA256 hashed OTP code for all verification purposes
- **Type**: String (SHA256 Hash)
- **Required**: No (temporary)
- **Storage**: SHA256 hash
- **Example**: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
- **Note**: Single field reused for email verification, phone verification, and password reset

### bema_otp_expiry
- **Description**: OTP expiration timestamp
- **Type**: Timestamp (Unix)
- **Required**: No (temporary)
- **Storage**: Integer
- **Example**: 1609459800
- **Note**: OTP expires 10 minutes after generation

### bema_otp_purpose
- **Description**: Purpose of OTP (tracking what the OTP is for)
- **Type**: String
- **Required**: No (temporary)
- **Storage**: Plain text
- **Possible Values**: "email_verification", "password_reset"
- **Example**: "email_verification"

### bema_fraud_flag
- **Description**: Fraud detection flag
- **Type**: Boolean
- **Required**: Yes (auto-set)
- **Storage**: Boolean (0 or 1)
- **Default**: false

## Field Usage Guidelines

### Naming Convention
All custom fields use the `bema_` prefix to:
1. Avoid conflicts with WordPress core fields
2. Prevent conflicts with other plugins
3. Make field identification easier
4. Maintain consistency across the codebase

### Data Types
Fields are stored using appropriate WordPress meta field types:
- Strings: Plain text values
- Numbers: Integer or float values
- Booleans: 0 (false) or 1 (true)
- Timestamps: Unix timestamp integers
- Encrypted Data: Base64 encoded strings (in current implementation)

### Required Fields
Required fields are validated during user registration:
- `bema_country`: Required during registration
- All other fields are optional

### Storage Security
Sensitive data is handled according to security best practices:
1. Phone numbers are encrypted before storage
2. OTP codes are hashed before storage
3. Authentication tokens are never stored
4. Personal data is stored in accordance with privacy regulations

### Field Lifecycle
Fields have different lifecycles based on their purpose:
1. **Permanent**: Profile and system fields that persist
2. **Temporary**: OTP fields that are cleared after use
3. **Auto-updated**: Timestamp fields updated during user actions

### Validation
Fields should be validated before storage:
1. Email format validation
2. Phone number format validation
3. Country/state value validation
4. Tier level and account type validation

### Cleanup
Temporary fields should be cleaned up after use:
1. OTP fields are deleted after verification
2. Expired OTP fields are periodically cleaned
3. Inactive accounts may be purged according to retention policies

## Implementation Notes

### WordPress Functions
Fields are accessed using standard WordPress functions:
```php
// Get a user meta field
$value = get_user_meta($user_id, 'bema_country', true);

// Update a user meta field
update_user_meta($user_id, 'bema_country', $new_value);

// Delete a user meta field
delete_user_meta($user_id, 'bema_temp_field');
```

### Field Registration
All fields should be registered in the system:
1. During plugin activation
2. When accessing user data
3. Through proper error handling

### Error Handling
Proper error handling should be implemented:
1. Check if fields exist before accessing
2. Handle missing or invalid field values
3. Log errors for debugging purposes

### Performance Considerations
For optimal performance:
1. Use appropriate indexes for frequently queried fields
2. Cache field values when appropriate
3. Minimize database queries
4. Use batch operations when updating multiple fields

## Best Practices

1. **Consistency**: Always use the `bema_` prefix for custom fields
2. **Documentation**: Keep this document updated with any field changes
3. **Validation**: Validate all user input before storing
4. **Security**: Encrypt sensitive information like phone numbers
5. **Defaults**: Set appropriate default values for system fields
6. **Cleanup**: Remove temporary fields (like OTP) after use
7. **Privacy**: Handle personal data in accordance with privacy regulations
8. **Testing**: Test all field operations thoroughly

## Important Notes

- **First Name and Last Name**: The standard WordPress `first_name` and `last_name` user properties are used instead of custom `bema_first_name` and `bema_last_name` meta fields. These are set during user creation and retrieved directly from the user object.

## Field Reference Table

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| bema_phone_number | String (Encrypted) | No | User's phone number |
| bema_country | String | Yes | User's country |
| bema_state | String | No | User's state |
| bema_referred_by | String | No | Referral code or user ID (set only during signup) |
| bema_tier_level | String | Yes | User's tier level |
| bema_account_type | String | Yes | Account type |
| bema_google_id | String | No | Google user ID |
| bema_facebook_id | String | No | Facebook user ID |
| bema_twitter_id | String | No | Twitter user ID |
| bema_email_verified | Boolean | Yes | Email verification status |
| bema_phone_verified | Boolean | Yes | Phone verification status |
| bema_device_id | String | Yes | Unique device identifier |
| bema_last_signin | Timestamp | No | Last signin timestamp |
| bema_last_signout | Timestamp | No | Last signout timestamp |
| bema_otp_code | String (SHA256) | No | Hashed OTP code |
| bema_otp_expiry | Timestamp | No | OTP expiration timestamp |
| bema_otp_purpose | String | No | Purpose of OTP |
| bema_fraud_flag | Boolean | Yes | Fraud detection flag |