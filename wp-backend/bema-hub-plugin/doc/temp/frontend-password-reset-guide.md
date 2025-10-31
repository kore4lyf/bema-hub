# Frontend Password Reset Implementation

## Quick Start

### 1. Configure Admin Settings
1. Go to **Bema Hub → General Settings**
   - Set **Frontend Base URL** (e.g., `http://localhost:3000`)
2. Go to **Bema Hub → Email Templates**
   - Set **Password Reset Page URL** (e.g., `reset-password`)

### 2. User Flow
1. User requests password reset → Email sent with direct reset link
2. User clicks link → Opens your frontend password reset page with OTP in URL path
3. Frontend extracts OTP from URL path → Verifies OTP with backend
4. If OTP is valid → Show new password form
5. User submits new password → Backend validates and updates

### 3. URL Structure
```
http://localhost:3000/reset-password/123456
```

## Implementation Code

### Extract OTP from URL Path (Next.js)
```javascript
// For URL: http://localhost:3000/reset-password/123456
// In Next.js page component (e.g., pages/reset-password/[otp].js)
import { useRouter } from 'next/router';

function ResetPasswordPage() {
  const router = useRouter();
  const { otp } = router.query; // Extracts '123456' from the URL
  
  // Verify OTP before showing password form
  useEffect(() => {
    if (otp) {
      verifyOtp(otp);
    }
  }, [otp]);
  
  // ... rest of component
}
```

### Verify OTP with Backend
```javascript
async function verifyOtp(otpCode) {
  try {
    const response = await fetch('/wp-json/bema-hub/v1/auth/verify-password-reset-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@example.com', // User's email (you need to get this from context or local storage)
        otp_code: otpCode // From URL path
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // OTP is valid - show password reset form
      setShowPasswordForm(true);
    } else {
      // Show error and redirect
      showError(data.message || 'Invalid or expired OTP');
      // Redirect to request new reset link
    }
  } catch (error) {
    showError('Network error. Please try again.');
  }
}
```

### Submit New Password
```javascript
async function submitNewPassword(newPassword) {
  try {
    const response = await fetch('/wp-json/bema-hub/v1/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@example.com', // User's email
        otp_code: otp, // From URL parameters
        new_password: newPassword
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Show success message
      showSuccess('Password reset successfully!');
      // Redirect to login page after short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      // Show error message
      showError(data.message || 'Failed to reset password');
    }
  } catch (error) {
    showError('Network error. Please try again.');
  }
}
```

## Backend Endpoints

### Request Reset (User enters email)
```
POST /wp-json/bema-hub/v1/auth/reset-password-request
Body: {email: "user@example.com"}
```

### Verify OTP (Frontend checks if OTP is valid)
```
POST /wp-json/bema-hub/v1/auth/verify-password-reset-otp
Body: {
  email: "user@example.com",
  otp_code: "123456" // From URL path
}
```

### Reset Password (User submits new password)
```
POST /wp-json/bema-hub/v1/auth/reset-password
Body: {
  email: "user@example.com",
  otp_code: "123456", // From URL path
  new_password: "user-entered-password"
}
```

## No Direct Token Handling
- OTP is part of the URL path, not query parameters
- Backend validates OTP before allowing password reset
- Users never see complex tokens, just a simple 6-digit code in the URL