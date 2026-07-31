import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    upsertCartItem(state, action: PayloadAction<CartItem>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.push(action.payload);
    },
    removeCartItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { setCart, upsertCartItem, removeCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
