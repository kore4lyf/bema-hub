import { configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import uiReducer from './features/ui/uiSlice';
import locationReducer from './features/location/locationSlice';
import { authApi } from './api/authApi';
import { locationApi } from './api/locationApi';
import { bemaHubApi } from './api/bemaHubApi';

const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  if (action.type.startsWith('auth/')) {
    const { auth } = store.getState() as RootState;
    localStorage.setItem('authData', JSON.stringify(auth));
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(localStorageMiddleware)
      .concat(authApi.middleware)
      .concat(locationApi.middleware)
      .concat(bemaHubApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
