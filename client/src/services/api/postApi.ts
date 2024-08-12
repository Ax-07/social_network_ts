import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Post {
  id: number;
  userId: string;
  content: string;
  picture?: string | null;
  video?: string | null;
  likers?: string[];
  dislikers?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const localUrl = "http://localhost:8080/api";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({ baseUrl: localUrl }),
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
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postApi;
