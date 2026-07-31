import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { StorageKeys } from '@/config/constants';

interface UiState {
  languageCode: string;
  theme: 'light' | 'dark';
}

const initialState: UiState = {
  languageCode: localStorage.getItem(StorageKeys.languageCode) || 'fr',
  theme: (localStorage.getItem(StorageKeys.theme) as 'light' | 'dark') || 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.languageCode = action.payload;
      localStorage.setItem(StorageKeys.languageCode, action.payload);
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
      localStorage.setItem(StorageKeys.theme, action.payload);
    },
  },
});

export const { setLanguage, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
