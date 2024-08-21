import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../stores";
import { CommentTypes, CommentResponseArray, CommentResponse } from "../../utils/types/comment.types";
import { updateCommentsCacheAfterAdd, updateCommentsCacheAfterDelete, updateCommentsCacheAfterUpdate } from "../utils/commentApiHelper";

interface AddCommentArgs {
    formData: FormData;
    origin: string;
}

const localUrl = "http://localhost:8080/api";

export const commentApi = createApi({
    reducerPath: "commentApi",
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
    tagTypes: ["Comments"],
    endpoints: (builder) => ({
        getCommentsByPostId: builder.query<CommentResponseArray, string>({
            query: (postId) => `/posts/comments/${postId}`,
            providesTags: (result) =>
                result && Array.isArray(result.data)
                    ? result.data.map(({ id }) => ({ type: "Comments", id }))
                    : [],
        }),
        getCommentsByCommentId: builder.query<CommentResponseArray, string>({
            query: (commentId) => `/comments/comments/${commentId}`,
            providesTags: (result) =>
                result && Array.isArray(result.data)
                    ? result.data.map(({ id }) => ({ type: "Comments", id }))
                    : [],
        }),
        getCommentById: builder.query<CommentResponse, string>({
            query: (id) => `/comments/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Comments", id }],
        }),
        addComment: builder.mutation<CommentResponse, AddCommentArgs>({
            query: ({formData}) => ({
                url: "/comments",
                method: "POST",
                body: formData,
            }),
            onQueryStarted: async ({origin}, { dispatch, queryFulfilled }) => {
                updateCommentsCacheAfterAdd(dispatch, queryFulfilled, origin);
            }
        }),
        updateComment: builder.mutation<CommentTypes, { id: string; patch: Partial<CommentTypes> }>({
            query: ({ id, patch }) => ({
                url: `/comments/${id}`,
                method: "PATCH",
                body: patch,
            }),
            onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
                updateCommentsCacheAfterUpdate(dispatch, id, queryFulfilled);
            }
        }),
        deleteComment: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `/comments/${id}`,
                method: "DELETE",
            }),
            onQueryStarted: async ( id, { dispatch }) => {
                updateCommentsCacheAfterDelete(dispatch, id);
            },
        }),
        likeComment: builder.mutation<CommentResponse, { id: string; likerId: string }>({
            query: ({ id, likerId }) => ({
                url: `/like-comment`,
                method: "PATCH",
                body: { commentId: id, likerId },
            }),
            onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
                updateCommentsCacheAfterUpdate(dispatch, id, queryFulfilled);
            },
        }),
    }),
});

export const {
    useGetCommentsByPostIdQuery,
    useGetCommentsByCommentIdQuery,
    useGetCommentByIdQuery,
    useAddCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useLikeCommentMutation,
} = commentApi;