import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import uiReducer from './features/ui/uiSlice';
import locationReducer from './features/location/locationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    location: locationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
