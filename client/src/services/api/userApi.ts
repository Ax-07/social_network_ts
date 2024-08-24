import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User, UserResponse, UserResponseArray } from "../../utils/types/user.types";

const localUrl = "http://localhost:8080/api";

export const UserApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: localUrl }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getUsers: builder.query<UserResponseArray, void>({
            query: () => "/users",
        }),
        getUserById: builder.query<UserResponse, string>({
            query: (id) => `/users/${id}`,
            providesTags: (_result, _error, id) => [{ type: "User", id }],
        }),
        createUser: builder.mutation<UserResponse, Partial<User>>({
            query: (user) => ({
                url: "/users",
                method: "POST",
                body: user,
            }),
        }),
        updateUser: builder.mutation<User, { id: number; patch: Partial<User> }>({
            query: ({ id, ...patch }) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: patch,
            }),
        }),
        deleteUser: builder.mutation<{ success: boolean; id: number }, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } = UserApi;