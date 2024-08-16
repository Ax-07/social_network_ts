import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../stores";
export interface Post {
  id: string;
  userId: string;
  content: string;
  media?: string | null;
  likers?: string[] | null;
  dislikers?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const localUrl = "http://localhost:8080/api";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: localUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "/posts",
    }),
    getPostById: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
    }),
    addPost: builder.mutation<Post, FormData>({
      query: (formData) => ({
        url: "/posts",
        method: "POST",
        body: formData,
      }),
    }),
    updatePost: builder.mutation<Post, { id: number; patch: Partial<Post> }>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: patch,
      }),
    }),
    deletePost: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
    }),
    likePost: builder.mutation<Post, { id: string; likers: string }>({
      query: ({ id, likers }) => ({
        url: `/like-post`,
        method: "PATCH",
        body: { postId: id, likerId: likers },
      }),
    }),
    repost: builder.mutation<Post, { id: string; reposters: string }>({
      query: ({ id, reposters }) => ({
        url: `/reposts`,
        method: "POST",
        body: { originalPostId: id, userId: reposters },
      }),
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
