import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../stores";
import { PostResponse, PostResponseTypes, PostTypes } from "../../utils/types/post.types";

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
    getPosts: builder.query<PostResponseTypes, void>({
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
        try {
          const { data } = await queryFulfilled;
          dispatch(
            postApi.util.updateQueryData('getPosts', undefined, (draftPosts) => {
              draftPosts.data.unshift(data.data); // Ajouter le nouveau post en tête de la liste
            })
          );
        } catch (error) {
          console.error("Failed to update cache after adding post:", error);
        }
      },
    }),
    updatePost: builder.mutation<PostTypes, { id: string; patch: Partial<PostTypes> }>({
      query: ({ id, patch }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Posts", id }],
    }),
    deletePost: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Posts", id }],
    }),
    likePost: builder.mutation<PostResponse, { id: string; likerId: string }>({
      query: ({ id, likerId }) => ({
        url: `/like-post`,
        method: "PATCH",
        body: { postId: id, likerId },
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            postApi.util.updateQueryData('getPostById', id, (draft) => {
              draft.data.likers = data.data.likers;
            })
          );
          dispatch(
            postApi.util.updateQueryData('getPosts', undefined, (draftPosts) => {
              const postToUpdate = draftPosts.data.find(post => post.id === id);
              if (postToUpdate) {
                postToUpdate.likers = data.data.likers;
              }
            })
          );
        } catch (error) {
          console.error("Failed to update cache after liking post:", error);
        }
      },
    }),
    repost: builder.mutation<PostTypes, { id: string; reposterId: string }>({
      query: ({ id, reposterId }) => ({
        url: `/reposts`,
        method: "POST",
        body: { originalPostId: id, userId: reposterId },
      }),
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
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
} = postApi;
