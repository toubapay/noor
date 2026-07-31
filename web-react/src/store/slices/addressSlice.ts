import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { StorageKeys } from '@/config/constants';
import type { Address } from '@/types';

interface AddressState {
  selected: Address | null;
}

function readCached(): Address | null {
  const raw = localStorage.getItem(StorageKeys.userAddress);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Address;
  } catch {
    return null;
  }
}

const initialState: AddressState = {
  selected: readCached(),
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setSelectedAddress(state, action: PayloadAction<Address>) {
      state.selected = action.payload;
      localStorage.setItem(StorageKeys.userAddress, JSON.stringify(action.payload));
    },
    clearSelectedAddress(state) {
      state.selected = null;
      localStorage.removeItem(StorageKeys.userAddress);
    },
  },
});

export const { setSelectedAddress, clearSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;
