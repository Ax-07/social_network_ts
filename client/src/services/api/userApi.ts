import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FollowersNamesRequest, User, UserResponse, UserResponseArray } from "../../utils/types/user.types";
import { updatePostCacheAfterAddToBookmarks, updateUserCacheAfterFollow } from "../utils/userApiQueryStarted";
import { RootState } from "../stores";

const localUrl = "http://localhost:8080/api";

export const UserApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: localUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
              headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
          },
     }),
    
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
        follow: builder.mutation<UserResponse, { userId: string; userToFollowId: string }>({
            query: ({ userId, userToFollowId }) => ({
                url: "/follow",
                method: "PATCH",
                body: { followerId: userId,followedId: userToFollowId },
            }),
            onQueryStarted: async ({ userId, userToFollowId }, { dispatch, queryFulfilled }) => {
                updateUserCacheAfterFollow(userId, userToFollowId, dispatch, queryFulfilled);
            },
        }),
        getFollowersNames: builder.query<FollowersNamesRequest, string>({
            query: (id) => `/users/${id}/followers`,
        }),
        addToBookmarks: builder.mutation<UserResponse, { userId: string; postId: string }>({
            query: ({ userId, postId }) => ({
                url: `/users/${userId}/bookmarks`,
                method: "PATCH",
                body: {userId, postId },
            }),
            onQueryStarted: async ({ userId, postId }, { dispatch, queryFulfilled }) => {
                updatePostCacheAfterAddToBookmarks( userId, postId , { dispatch, queryFulfilled });
            }
        }),
    }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useFollowMutation,
  useGetFollowersNamesQuery,
  useAddToBookmarksMutation,
} = UserApi;