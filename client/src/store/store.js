import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from '@/lib/base.api';
import authReducer from '@/store/auth.slice';
import cartReducer from '@/store/cart.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
