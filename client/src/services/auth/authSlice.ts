import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../utils/types/user.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginSuccessPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface LoginFailPayload {
  error: string;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    refreshToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    loginFail: (state, action: PayloadAction<LoginFailPayload>) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    logout: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFail, logout } = authSlice.actions;
export default authSlice.reducer;
export type { AuthState };
