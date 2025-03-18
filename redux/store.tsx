import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Import authentication slice
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Register auth reducer
    theme: themeReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
