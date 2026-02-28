import { createSlice } from "@reduxjs/toolkit";

const savedAuth = JSON.parse(localStorage.getItem("kc_auth") || "null");

const initialState = {
  isAuthenticated: Boolean(savedAuth?.token),
  token: savedAuth?.token || null,
  refreshToken: savedAuth?.refreshToken || null,
  user: savedAuth?.user || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, refreshToken, user } = action.payload;

      state.isAuthenticated = true;
      state.token = token;
      if (refreshToken) state.refreshToken = refreshToken;
      state.user = user;

      localStorage.setItem(
        "kc_auth",
        JSON.stringify({
          token,
          refreshToken: refreshToken ?? state.refreshToken,
          user,
        }),
      );
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.user = null;

      localStorage.removeItem("kc_auth");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
