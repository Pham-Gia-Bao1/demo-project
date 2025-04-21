import { configureStore } from '@reduxjs/toolkit';
import taskSlice from './taskSlice.ts';
import authSlice from './authSlice.ts';
import imageSlice from './imageSlice.ts';

export const store = configureStore({
  reducer: {
    tasks: taskSlice,
    auth: authSlice,
    images: imageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;