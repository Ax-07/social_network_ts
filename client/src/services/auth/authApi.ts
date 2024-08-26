import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../utils/types/user.types";

const localUrl = "http://localhost:8080/api";

export interface AuthResponse {
  status: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken?: string;
  };
  message: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: localUrl }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    register: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;