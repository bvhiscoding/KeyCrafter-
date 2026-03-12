import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from '@/lib/base.api';
import authReducer from '@/store/auth.slice';
import cartReducer from '@/store/cart.slice';
import wishlistReducer from '@/store/wishlist.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
