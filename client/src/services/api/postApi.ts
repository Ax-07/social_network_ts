import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../stores";
import { PostResponse, PostResponseArray, PostTypes } from "../../utils/types/post.types";
import { 
  updatePostCacheAfterAdd,
  updatePostCacheAfterDelete,
  updatePostCacheAfterLike,
  updatePostCacheAfterRepost,
  updatePostCacheAfterUpdate,
  updatePostCacheAfterViews
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
    getPostById: builder.query<PostResponse, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Posts", id }],
    }),
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
    deletePost: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch }) => {
        updatePostCacheAfterDelete(dispatch, id);
      }
    }),
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
    repost: builder.mutation<PostResponse, FormData>({
      query: (formdata) => ({
        url: `/reposts`,
        method: "POST",
        body: formdata,
      }),
      onQueryStarted: async (formdata, { dispatch, queryFulfilled }) => {
        const userId = formdata.get("userId") as string;
        const originalPostId = formdata.get("originalPostId") as string;
        updatePostCacheAfterRepost(dispatch, userId, originalPostId, queryFulfilled);
      },
    }),
    incrementPostViews: builder.mutation<PostResponseArray, {postId: string, count: string}[]>({
      query: (postViewCounts) => ({
        url: `/posts/views`,
        method: "POST",
        body: { postViewCounts },
      }),
    }),
    getBookmarkedPosts: builder.query<PostResponseArray, string>({
      query: (userId) => `/posts/bookmarks?id=${userId}`,
      providesTags: (result) =>
        result && Array.isArray(result.data)
          ? [
              ...result.data.map(({ id }) => ({ type: "Posts" as const, id })),
              { type: "Posts", id: "BOOKMARKS" },
            ]
          : [{ type: "Posts", id: "BOOKMARKS" }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useRepostMutation,
  useIncrementPostViewsMutation,
  useGetBookmarkedPostsQuery,
} = postApi;
