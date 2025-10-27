import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  name: string
  username?: string
  avatar_url?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  pendingUserEmail: string | null
  resetUserEmail: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  pendingUserEmail: null,
  resetUserEmail: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; authData?: any }>) => {
      const { user, token, authData } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      
      // Store complete auth data (includes token)
      const completeAuthData = authData || { token, user, isAuthenticated: true }
      localStorage.setItem('authData', JSON.stringify(completeAuthData))
    },
    signOut: (state) => {
      localStorage.removeItem('authData')
      
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.pendingUserEmail = null
      state.resetUserEmail = null
    },
    logout: (state) => {
      localStorage.removeItem('authData')
      
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.pendingUserEmail = null
      state.resetUserEmail = null
    },
    setPendingUserEmail: (state, action: PayloadAction<string>) => {
      state.pendingUserEmail = action.payload
    },
    clearPendingUserEmail: (state) => {
      state.pendingUserEmail = null
    },
    setResetUserEmail: (state, action: PayloadAction<string>) => {
      state.resetUserEmail = action.payload
    },
    clearResetUserEmail: (state) => {
      state.resetUserEmail = null
    },
    hydrateAuth: (state) => {
      if (typeof window !== 'undefined') {
        const authData = localStorage.getItem('authData')
        if (authData) {
          try {
            const parsedData = JSON.parse(authData)
            if (parsedData.user && parsedData.token) {
              state.user = parsedData.user
              state.token = parsedData.token
              state.isAuthenticated = parsedData.isAuthenticated || true
            }
          } catch (error) {
            localStorage.removeItem('authData')
          }
        }
      }
    },
  },
})

export const { 
  setCredentials, 
  signOut, 
  logout, 
  setPendingUserEmail, 
  clearPendingUserEmail, 
  setResetUserEmail,
  clearResetUserEmail,
  hydrateAuth 
} = authSlice.actions
export default authSlice.reducer
