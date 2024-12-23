import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../stores";
import { TrendsResponse, PostResponse, PostResponseArray, PostTypes } from "../../utils/types/post.types";
import { 
  updatePostCacheAfterAdd,
  updatePostCacheAfterDelete,
  updatePostCacheAfterLike,
  updatePostCacheAfterRepost,
  updatePostCacheAfterUpdate,
} from "../utils/postApiHelpers";

const localUrl = "http://localhost:8080/api";

export const postApi = createApi({
  reducerPath: "postApi",
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
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    // Get all posts
    getPosts: builder.query<PostResponseArray, void>({
      query: () => "/posts",
      providesTags: (result) =>
        result && Array.isArray(result.data)
          ? [
              ...result.data.map(({ id }) => ({ type: "Posts" as const, id })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),

    // Get posts by subscription
    getPostBySubscription: builder.query<PostResponseArray, string>({
      query: (userId) => `/posts/user/${userId}/subscription`,
      providesTags: (result) =>
        result && Array.isArray(result.data)
          ? [
              ...result.data.map(({ id }) => ({ type: "Posts" as const, id })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),

    // Get posts by hashtag
    getPostsByHashtag: builder.query<PostResponseArray, string>({
      query: (hashtag) => `/posts/hashtags/${hashtag}`,
      providesTags: (result) =>
        result && Array.isArray(result.data)
          ? result.data.map(({ id }) => ({ type: "Posts", id }))
          : [{ type: "Posts", id: "LIST" }],
    }),

    // Get trends hashtags & mentions
    getTrends: builder.query<TrendsResponse, void>({
      query: () => "/posts/hashtags/trends",
    }),

    // Get post by id
    getPostById: builder.query<PostResponse, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Posts", id }],
    }),

    // Get posts by user id
    getPostsByUserId: builder.query<PostResponseArray, string>({
      query: (userId) => `/posts/user/${userId}`,
      providesTags: (result) =>
        result && Array.isArray(result.data)
          ? result.data.map(({ id }) => ({ type: "Posts", id }))
          : [{ type: "Posts", id: "LIST" }],
    }),

    // Add post
    addPost: builder.mutation<PostResponse, FormData>({
      query: (formData) => ({
        url: "/posts",
        method: "POST",
        body: formData,
      }),
      onQueryStarted: async (_formData, { dispatch, queryFulfilled }) => {
        updatePostCacheAfterAdd(dispatch, queryFulfilled);
      },
    }),

    // Update post
    updatePost: builder.mutation<PostTypes, { id: string; patch: Partial<PostTypes> }>({
      query: ({ id, patch }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: patch,
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        updatePostCacheAfterUpdate(dispatch, id, queryFulfilled);
      },
    }),

    // Delete post
    deletePost: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch }) => {
        updatePostCacheAfterDelete(dispatch, id);
      }
    }),

    // Like post
    likePost: builder.mutation<PostResponse, { id: string; likerId: string }>({
      query: ({ id, likerId }) => ({
        url: `/like-post`,
        method: "PATCH",
        body: { postId: id, likerId },
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        updatePostCacheAfterLike(dispatch, id, queryFulfilled);
      },
    }),

    // Repost
    repost: builder.mutation<PostResponse, FormData>({
      query: (formdata) => ({
        url: `/reposts`,
        method: "POST",
        body: formdata,
      }),
      onQueryStarted: async (formdata, { dispatch, queryFulfilled }) => {
        const userId = formdata.get("userId") as string;
        const originalPostId = formdata.get("originalPostId") as string;
        const originalCommentId = formdata.get("originalCommentId") as string;
        updatePostCacheAfterRepost(dispatch, userId, originalPostId, originalCommentId, queryFulfilled);
      },
    }),

    // Increment post views
    incrementPostViews: builder.mutation<PostResponseArray, {postId: string, count: string}[]>({
      query: (postViewCounts) => ({
        url: `/posts/views`,
        method: "POST",
        body: { postViewCounts },
      }),
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostBySubscriptionQuery,
  useGetPostsByHashtagQuery,
  useGetTrendsQuery,
  useGetPostByIdQuery,
  useGetPostsByUserIdQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useRepostMutation,
  useIncrementPostViewsMutation,
} = postApi;
