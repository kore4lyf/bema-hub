/**
 * Type definitions for Bema Hub API based on official documentation
 */

// Request interfaces
export interface SignupRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  phone_number: string
  country: string
  state: string
  referred_by?: string
}

export interface VerifyOtpRequest {
  email: string
  otp_code: string
}

export interface SigninRequest {
  username: string
  password: string
}

export interface SocialLoginRequest {
  provider: string
  provider_id: string
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  country?: string
  state?: string
}

export interface ValidateTokenRequest {
  token: string
}

export interface ResetPasswordRequestRequest {
  email: string
}

export interface ResetPasswordVerifyRequest {
  email: string
  otp_code: string
}

export interface ResetPasswordFinalRequest {
  email: string
  otp_code: string
  new_password: string
}

export interface UpdateProfileRequest {
  first_name?: string
  last_name?: string
  display_name?: string
  bema_phone_number?: string
  bema_country?: string
  bema_state?: string
}

export interface ResendOtpRequest {
  email: string
}

// Response interfaces
export interface AuthResponse {
  success?: boolean
  message?: string
  token?: string
  user_email?: string
  user_id?: number
  user_login?: string
  user_display_name?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  bema_email_verified?: boolean
  bema_referred_by?: string
  role?: string
}

export interface SignupResponse {
  success: boolean
  message: string
  user_email: string
  bema_email_verified: boolean
  bema_referred_by: string
  role: string
}

export interface VerifyOtpResponse {
  success: boolean
  message: string
}

export interface SigninResponse {
  token: string
  user_id: number
  user_login: string
  user_email: string
  user_display_name: string
  first_name: string
  last_name: string
  avatar_url: string
  bema_email_verified: boolean
  bema_referred_by: string
  role: string
}

export interface SocialLoginResponse {
  success: boolean
  token: string
  user_id: number
  user_login: string
  user_email: string
  user_display_name: string
  first_name: string
  last_name: string
  avatar_url: string
  bema_email_verified: boolean
  bema_referred_by: string
  role: string
}

export interface SignoutResponse {
  success: boolean
  message: string
}

export interface ValidateTokenResponse {
  valid: boolean
  data?: {
    user_id: number
    user_login: string
    user_email: string
    first_name: string
    last_name: string
    avatar_url: string
    bema_email_verified: boolean
    bema_referred_by: string
    role: string
  }
}

export interface ResetPasswordRequestResponse {
  success: boolean
  message: string
}

export interface ResetPasswordVerifyResponse {
  success: boolean
  message: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

export interface ProfileResponse {
  id: number
  username: string
  email: string
  display_name: string
  first_name: string
  last_name: string
  avatar_url: string
  bema_phone_number: string
  bema_country: string
  bema_state: string
  bema_referred_by: string
  bema_tier_level: string
  bema_account_type: string
  bema_email_verified: boolean
  bema_phone_verified: boolean
  bema_fraud_flag: boolean
  bema_device_id: string
  bema_last_signin: number
  bema_last_signout: number
  bema_google_id?: string
  bema_facebook_id?: string
  bema_twitter_id?: string
  role: string
}