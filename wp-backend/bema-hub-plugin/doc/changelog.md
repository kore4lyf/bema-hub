# Changelog

## [1.0.0] - 2025-10-29

### Added
- New endpoint `/wp-json/bema-hub/v1/auth/verify-password-reset-otp` for Next.js frontend integration
- Configurable password reset daily limit (default: 5 requests per day)
- Configurable email OTP daily limit (default: 10 requests per day)
- Admin settings for password reset and email OTP daily limits
- Documentation for password reset OTP verification flow
- Path-based routing support for Next.js frontend

### Changed
- Updated OTP controller to use configurable daily limits from admin settings
- Enhanced rate limiting to use user_meta fields for tracking requests
- Improved time formatting in rate limiting messages
- Updated email template system to support path-based routing for Next.js
- Modified password reset flow to work with OTP codes in URL paths
- Updated frontend documentation to reflect Next.js path-based routing

### Fixed
- Fixed syntax error in admin settings page
- Enhanced HTML error sanitization in JWT auth class
- Improved password reset flow for better Next.js integration
- Resolved issues with rate limiting implementation

## API Endpoints

### New Endpoint
- `POST /wp-json/bema-hub/v1/auth/verify-password-reset-otp` - Verify password reset OTP before allowing new password input

### Updated Endpoints
- `POST /wp-json/bema-hub/v1/auth/reset-password-request` - Now uses configurable daily limit
- `POST /wp-json/bema-hub/v1/auth/resend-otp` - Now uses configurable daily limit
- `POST /wp-json/bema-hub/v1/auth/reset-password` - Now works with OTP from URL path

## Admin Settings

### New Fields
- Password Reset Daily Limit (1-50 requests)
- Email OTP Daily Limit (1-50 requests)

### Default Values
- Password Reset Daily Limit: 5 requests per day
- Email OTP Daily Limit: 10 requests per day

## Frontend Integration

### Next.js Path-based Routing
- Password reset URLs now use path-based routing: `http://localhost:3000/reset-password/123456`
- New endpoint allows frontend to verify OTP validity before showing password input form
- Updated documentation for Next.js implementation

### Security Enhancements
- OTP codes are now part of URL paths instead of query parameters
- Improved rate limiting with configurable daily limits
- Better error handling and user feedback