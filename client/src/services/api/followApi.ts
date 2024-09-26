import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../stores";
import { FollowersNamesRequest, UserResponse, WhoToFollowResponse } from "../../utils/types/user.types";
import { updateUserCacheAfterFollow } from "../utils/userApiQueryStarted";

const localUrl = "http://localhost:8080/api";

export const followApi = createApi({
  reducerPath: "followApi",
  baseQuery: fetchBaseQuery({
    baseUrl: localUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Follows"],
  endpoints: (builder) => ({
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
    getFollowers: builder.query<FollowersNamesRequest, string>({
        query: (id) => `/users/${id}/followers`,
    }),
    getWhoToFollow: builder.query<WhoToFollowResponse, string>({
        query: (id) => `/users/${id}/whoToFollow`,
    }),
  }),
});

export const {
  useFollowMutation,
  useGetFollowersQuery,
  useGetWhoToFollowQuery,
} = followApi;