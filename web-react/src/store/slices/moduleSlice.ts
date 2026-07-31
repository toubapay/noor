import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { StorageKeys } from '@/config/constants';
import type { Module } from '@/types';

interface ModuleState {
  current: Module | null;
}

function readCached(): Module | null {
  const raw = localStorage.getItem(StorageKeys.cacheModuleId);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Module;
  } catch {
    return null;
  }
}

const initialState: ModuleState = {
  current: readCached(),
};

const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    setModule(state, action: PayloadAction<Module>) {
      state.current = action.payload;
      localStorage.setItem(StorageKeys.moduleId, String(action.payload.id));
      localStorage.setItem(StorageKeys.cacheModuleId, JSON.stringify(action.payload));
    },
    clearModule(state) {
      state.current = null;
      localStorage.removeItem(StorageKeys.moduleId);
      localStorage.removeItem(StorageKeys.cacheModuleId);
    },
  },
});

export const { setModule, clearModule } = moduleSlice.actions;
export default moduleSlice.reducer;
