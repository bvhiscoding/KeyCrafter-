/**
 * wishlist.slice.js
 *
 * Persists wishlist product IDs to localStorage so:
 *  - The heart icon renders instantly on page reload (no waiting for API)
 *  - Optimistic toggles feel instant while the server confirms in background
 *
 * The source of truth is still the server; this slice is only a local cache
 * for the "inWishlist" boolean check and is kept in sync by user.api.js
 * via the `onQueryStarted` optimistic-update pattern.
 */
import { createSlice } from '@reduxjs/toolkit';

import { logout } from '@/store/auth.slice';

const STORAGE_KEY = 'kc_wishlist';

// Hydrate from localStorage so the first render already knows what's wishlisted
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveToStorage = (ids) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore quota errors */
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    // Array of product ID strings
    ids: loadFromStorage(),
  },
  reducers: {
    /**
     * Replace the entire wishlist (called after a successful server response).
     * Accepts either an array of product objects or an array of ID strings.
     */
    setWishlist: (state, action) => {
      const items = Array.isArray(action.payload) ? action.payload : [];
      state.ids = items.map((item) =>
        typeof item === 'string' ? item : String(item._id || item.id || item),
      );
      saveToStorage(state.ids);
    },

    /** Optimistic add — toggle ON immediately */
    addWishlistId: (state, action) => {
      const id = String(action.payload);
      if (!state.ids.includes(id)) {
        state.ids.push(id);
        saveToStorage(state.ids);
      }
    },

    /** Optimistic remove — toggle OFF immediately */
    removeWishlistId: (state, action) => {
      const id = String(action.payload);
      state.ids = state.ids.filter((x) => x !== id);
      saveToStorage(state.ids);
    },

    /** Called on logout to wipe everything */
    clearWishlist: (state) => {
      state.ids = [];
      localStorage.removeItem(STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.ids = [];
      localStorage.removeItem(STORAGE_KEY);
    });
  },
});

export const { setWishlist, addWishlistId, removeWishlistId, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
