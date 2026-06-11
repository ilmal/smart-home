import { configureStore } from '@reduxjs/toolkit';
import lightsReducer from './lightsSlice';

export const store = configureStore({
  reducer: {
    lights: lightsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
