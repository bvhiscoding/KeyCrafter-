import { createSlice } from '@reduxjs/toolkit';

const savedCart = JSON.parse(localStorage.getItem('kc_cart') || '[]');

const calculateTotals = (items) => {
  return {
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
};

const initialState = calculateTotals(savedCart);

const syncLocalCart = (items) => {
  localStorage.setItem('kc_cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const found = state.items.find((item) => item.id === product.id);

      if (found) {
        found.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
      syncLocalCart(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const found = state.items.find((item) => item.id === id);

      if (!found) {
        return;
      }

      found.quantity = Math.max(1, quantity);
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
      syncLocalCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
      syncLocalCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
      syncLocalCart([]);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
