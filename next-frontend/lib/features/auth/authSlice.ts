import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Sign in failed')
    }
    
    // Store auth data in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token)
    }
    if (data.user_email) {
      localStorage.setItem('userEmail', data.user_email)
    }
    if (data.user_nicename) {
      localStorage.setItem('userName', data.user_nicename)
    }
    if (data.user_display_name) {
      localStorage.setItem('userDisplayName', data.user_display_name)
    }
    
    // Store complete auth data as JSON
    localStorage.setItem('authData', JSON.stringify({
      token: data.token,
      user: {
        id: data.user_id || '',
        email: data.user_email || email,
        name: data.user_display_name || data.user_nicename || email,
      },
      isAuthenticated: true,
    }))
    
    return data
  }
)

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    country: string;
    state: string;
    referred_by?: string;
  }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/custom/v1/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Sign up failed')
    }
    
    // Store auth data in localStorage if token is returned
    if (data.token) {
      localStorage.setItem('authToken', data.token)
      
      if (data.user_email) {
        localStorage.setItem('userEmail', data.user_email)
      }
      if (data.user_name || data.user_nicename) {
        localStorage.setItem('userName', data.user_name || data.user_nicename)
      }
      if (data.user_display_name) {
        localStorage.setItem('userDisplayName', data.user_display_name)
      }
      
      // Store complete auth data as JSON
      localStorage.setItem('authData', JSON.stringify({
        token: data.token,
        user: {
          id: data.user_id || '',
          email: data.user_email || userData.email,
          name: data.user_display_name || `${userData.first_name} ${userData.last_name}`,
        },
        isAuthenticated: true,
      }))
    }
    
    return data
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      // Clear all auth data from localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('authData')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      localStorage.removeItem('userDisplayName')
      
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    // Hydrate auth state from localStorage
    hydrateAuth: (state) => {
      if (typeof window !== 'undefined') {
        const authData = localStorage.getItem('authData')
        if (authData) {
          try {
            const parsedData = JSON.parse(authData)
            state.user = parsedData.user
            state.token = parsedData.token
            state.isAuthenticated = parsedData.isAuthenticated
          } catch (error) {
            // If parsing fails, clear invalid data
            localStorage.removeItem('authData')
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Sign in failed'
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Sign up failed'
      })
  },
})

export const { signOut, clearError, hydrateAuth } = authSlice.actions
export default authSlice.reducer
