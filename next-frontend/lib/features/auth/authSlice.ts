import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ProfileResponse } from '@/lib/api/types'

interface User {
  id: string
  email: string
  name: string
  username?: string
  avatar_url?: string
  first_name?: string
  last_name?: string
  bema_email_verified?: boolean
  bema_referred_by?: string
  bema_tier_level?: string
  bema_account_type?: string
  bema_phone_verified?: boolean
  bema_fraud_flag?: boolean
  bema_country?: string
  bema_state?: string
  bema_phone_number?: string
  role?: string
  display_name?: string
  bema_device_id?: string
  bema_last_signin?: number
  bema_last_signout?: number
  bema_google_id?: string
  bema_facebook_id?: string
  bema_twitter_id?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  authData: any | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  authData: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ authData: any }>) => {
      const { authData } = action.payload
      state.token = authData.token || state.token
      state.user = {
        id: authData.user_id?.toString() || authData.id?.toString() || '',
        email: authData.user_email || authData.email || '',
        name: authData.user_display_name || authData.display_name || '',
        username: authData.user_login || authData.username,
        avatar_url: authData.avatar_url,
        first_name: authData.first_name,
        last_name: authData.last_name,
        bema_email_verified: authData.bema_email_verified,
        bema_referred_by: authData.bema_referred_by,
        bema_tier_level: authData.bema_tier_level,
        bema_account_type: authData.bema_account_type,
        bema_phone_verified: authData.bema_phone_verified,
        bema_fraud_flag: authData.bema_fraud_flag,
        bema_country: authData.bema_country,
        bema_state: authData.bema_state,
        bema_phone_number: authData.bema_phone_number,
        role: authData.role,
        display_name: authData.display_name,
        bema_device_id: authData.bema_device_id,
        bema_last_signin: authData.bema_last_signin,
        bema_last_signout: authData.bema_last_signout,
        bema_google_id: authData.bema_google_id,
        bema_facebook_id: authData.bema_facebook_id,
        bema_twitter_id: authData.bema_twitter_id,
      }
      state.authData = authData
      state.isAuthenticated = !!state.token
    },
    signOut: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.authData = null
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.authData = null
    },
    hydrateAuth: (state, action: PayloadAction<AuthState>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { 
  setCredentials, 
  signOut, 
  logout,
  hydrateAuth
} = authSlice.actions
export default authSlice.reducer