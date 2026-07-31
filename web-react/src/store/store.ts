import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import cartReducer from '@/store/slices/cartSlice';
import moduleReducer from '@/store/slices/moduleSlice';
import addressReducer from '@/store/slices/addressSlice';
import uiReducer from '@/store/slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    module: moduleReducer,
    address: addressReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
