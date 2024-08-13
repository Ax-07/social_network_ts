import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../api/userApi";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginSuccessPayload {
  user: User;
  token: string;
}

interface LoginFailPayload {
  error: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
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
      state.token = action.payload.token;
    },
    loginFail: (state, action: PayloadAction<LoginFailPayload>) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    logout: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFail, logout } = authSlice.actions;
export default authSlice.reducer;
export type { AuthState };
