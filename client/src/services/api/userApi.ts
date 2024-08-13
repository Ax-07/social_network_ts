import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
    id: number; // Identifiant unique de l'utilisateur
    googleId?: string; // Identifiant Google pour l'authentification OAuth
    username: string; // Nom d'utilisateur
    email?: string; // Adresse e-mail
    password: string; // Mot de passe haché
    profilPicture?: string; // Image de profil
    coverPicture?: string; // Image de couverture
    bio?: string; // Biographie
    followers?: string[]; // Liste des abonnés
    followings?: string[]; // Liste des abonnements
}

const localUrl = "http://localhost:8080/api";

export const UserApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: localUrl }),
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => "/users",
        }),
        getUserById: builder.query<User, number>({
            query: (id) => `/users/${id}`,
        }),
        createUser: builder.mutation<User, Partial<User>>({
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