const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function requestPasswordReset(email: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Password reset request failed');
    }
    
    return data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
}

export async function verifyResetOTP(email: string, otpCode: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        otp_code: otpCode
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed');
    }
    
    return data;
  } catch (error) {
    console.error('Reset OTP verification error:', error);
    throw error;
  }
}

export async function setNewPassword(resetToken: string, newPassword: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reset_token: resetToken,
        new_password: newPassword
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Password reset failed');
    }
    
    return data;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}
