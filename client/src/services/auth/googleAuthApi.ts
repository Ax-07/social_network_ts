import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = 'http://localhost:8080/api';
export const googleAuthApi = createApi({
    reducerPath: "googleAuthApi",
    baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        googleLogin: builder.mutation({
            query: (body) => ({
                url: "/auth/google/callback",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const { useGoogleLoginMutation } = googleAuthApi;