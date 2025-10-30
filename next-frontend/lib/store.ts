import { configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import uiReducer from './features/ui/uiSlice';
import locationReducer from './features/location/locationSlice';
import { authApi } from './api/authApi';
import { locationApi } from './api/locationApi';
import { bemaHubApi } from './api/bemaHubApi';
import { blogApi } from './api/blogApi';

const localStorageMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);
  
  if (action.type?.startsWith('auth/')) {
    const { auth } = store.getState() as RootState;
    localStorage.setItem('authData', JSON.stringify(auth));
    
    // Also set a cookie for server-side middleware to check
    if (typeof window !== 'undefined') {
      if (auth.isAuthenticated && auth.token) {
        document.cookie = `auth-token=${auth.token}; path=/; max-age=86400`; // 24 hours
      } else {
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    location: locationReducer,
    [authApi.reducerPath]: authApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [bemaHubApi.reducerPath]: bemaHubApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(localStorageMiddleware)
      .concat(authApi.middleware)
      .concat(locationApi.middleware)
      .concat(bemaHubApi.middleware)
      .concat(blogApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;