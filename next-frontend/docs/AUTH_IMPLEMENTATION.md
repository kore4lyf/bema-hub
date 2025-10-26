# Authentication Implementation Guide

## Overview
This project uses NextAuth.js v5 (beta) for authentication with multiple providers and OTP verification for email signups.

## Features Implemented

### 1. Authentication Providers
- ✅ Email/Password (Credentials)
- ✅ Google OAuth
- ✅ Facebook OAuth
- ✅ Twitter/X OAuth

### 2. OTP Verification
- ✅ 6-digit OTP generation
- ✅ Email delivery integration
- ✅ 10-minute expiration
- ✅ Verification before account creation

### 3. User Flow

#### Sign Up Flow
1. User fills registration form (name, email, password)
2. System generates 6-digit OTP
3. OTP sent to user's email
4. User enters OTP for verification
5. Upon successful verification, account is created in WordPress
6. User redirected to sign-in page

#### Sign In Flow
1. User enters email and password
2. Credentials validated against WordPress API
3. Session created upon successful authentication
4. User redirected to dashboard/home

#### Social Auth Flow
1. User clicks social provider button
2. Redirected to provider's OAuth page
3. Upon authorization, account created/linked
4. Session created and user redirected

## File Structure

```
app/
├── api/
│   └── auth/
│       ├── [...nextauth]/
│       │   └── route.ts          # NextAuth API handler
│       ├── otp/
│       │   └── route.ts          # OTP generation & verification
│       └── signup/
│           └── route.ts          # User registration
├── signin/
│   └── page.tsx                  # Sign in page
└── signup/
    └── page.tsx                  # Sign up page with OTP

lib/
└── auth.ts                       # NextAuth configuration

components/
└── custom/
    ├── Navbar.tsx                # Updated with session management
    └── SessionProvider.tsx       # Session context wrapper
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# WordPress API
NEXT_PUBLIC_API_URL=https://www.bemahub.local

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Twitter OAuth
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret

# Email (for OTP)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@bemahub.com
```

## WordPress API Endpoints Required

### 1. User Registration
```
POST /wp-json/wp/v2/users
Body: {
  username: string,
  email: string,
  password: string,
  name: string,
  roles: ["subscriber"]
}
```

### 2. User Login
```
POST /wp-json/wp/v2/users/login
Body: {
  email: string,
  password: string
}
Response: {
  id: number,
  email: string,
  name: string,
  token: string
}
```

### 3. Send OTP Email
```
POST /wp-json/bema/v1/send-otp
Body: {
  email: string,
  otp: string
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install next-auth@beta nodemailer react-hook-form @hookform/resolvers --legacy-peer-deps
```

### 2. Configure OAuth Providers

#### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### Facebook
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Add redirect URI: `http://localhost:3000/api/auth/callback/facebook`

#### Twitter/X
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Enable OAuth 2.0
4. Add callback URL: `http://localhost:3000/api/auth/callback/twitter`

### 3. Generate NextAuth Secret
```bash
openssl rand -base64 32
```

### 4. WordPress Plugin Setup

Create a custom WordPress plugin to handle:
- Custom user registration endpoint
- OTP email sending
- User authentication

## Security Considerations

1. **OTP Storage**: Currently using in-memory storage. For production:
   - Use Redis for distributed systems
   - Implement rate limiting
   - Add IP-based restrictions

2. **Password Security**:
   - Minimum 8 characters
   - WordPress handles hashing
   - Consider adding password strength requirements

3. **Session Management**:
   - Sessions stored securely with NextAuth
   - Automatic session refresh
   - Secure cookie settings

4. **CSRF Protection**:
   - Built-in with NextAuth
   - CSRF tokens on all forms

## Testing

### Test OTP Flow
1. Navigate to `/signup`
2. Fill in registration form
3. Check console/email for OTP
4. Enter OTP to complete registration

### Test Social Auth
1. Navigate to `/signin`
2. Click social provider button
3. Complete OAuth flow
4. Verify session creation

## Troubleshooting

### OTP Not Received
- Check email configuration
- Verify SMTP settings
- Check spam folder
- Review server logs

### OAuth Errors
- Verify redirect URIs match exactly
- Check client ID and secret
- Ensure OAuth app is in production mode
- Review provider-specific requirements

### Session Issues
- Clear browser cookies
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain

## Next Steps

1. Implement password reset flow
2. Add email verification for social auth
3. Implement 2FA (Two-Factor Authentication)
4. Add account linking (merge social + email accounts)
5. Implement session management dashboard
6. Add audit logs for security events

## API Integration Notes

The current implementation expects WordPress REST API endpoints. You may need to:

1. Create custom WordPress endpoints for:
   - User registration with role assignment
   - OTP email sending
   - Custom authentication logic

2. Install WordPress plugins:
   - JWT Authentication for WordPress REST API
   - Custom REST API endpoints plugin

3. Configure WordPress:
   - Enable REST API
   - Set up CORS headers
   - Configure user roles (Supporters = subscribers)

## Support

For issues or questions:
- Check NextAuth.js documentation: https://next-auth.js.org/
- Review WordPress REST API docs: https://developer.wordpress.org/rest-api/
- Contact development team
