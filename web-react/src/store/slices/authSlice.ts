import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { StorageKeys } from '@/config/constants';
import type { User } from '@/types';

interface AuthState {
  token: string | null;
  user: User | null;
  isGuest: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem(StorageKeys.token),
  user: null,
  isGuest: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (action.payload) localStorage.setItem(StorageKeys.token, action.payload);
      else localStorage.removeItem(StorageKeys.token);
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setGuest(state, action: PayloadAction<boolean>) {
      state.isGuest = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isGuest = false;
      localStorage.removeItem(StorageKeys.token);
    },
  },
});

export const { setToken, setUser, setGuest, logout } = authSlice.actions;
export default authSlice.reducer;
