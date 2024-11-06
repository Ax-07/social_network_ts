import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../stores";
import { updateQuestionCacheAfterResponse } from "../utils/questionApiHelper";
import { QuestionResponse, QuestionResponseArray } from "../../utils/types/question.types";

const localUrl = "http://localhost:8080/api";

export const questionApi = createApi({
  reducerPath: "questionApi",
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
  tagTypes: ["Questions"],
  endpoints: (builder) => ({
    // Get all questions
    getQuestions: builder.query<QuestionResponseArray, void>({
      query: () => "/questions",
      providesTags: ["Questions"],
    }),

    // Get a question by id
    getQuestionById: builder.query<QuestionResponse, string>({
      query: (id) => `/questions/${id}`,
      providesTags: ["Questions"],
    }),

    // Create a question
    createQuestion: builder.mutation<QuestionResponse, { question: string }>({
      query: ({ question }) => ({
        url: "/questions",
        method: "POST",
        body: { question },
      }),
      invalidatesTags: ["Questions"],
    }),

    // Update a question
    updateQuestion: builder.mutation<QuestionResponse, { id: string; question: string }>({
      query: ({ id, question }) => ({
        url: `/questions/${id}`,
        method: "PATCH",
        body: { question },
      }),
      invalidatesTags: ["Questions"],
    }),

    // Delete a question
    deleteQuestion: builder.mutation<QuestionResponse, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),

    // Response to a question
    responseToQuestion: builder.mutation<QuestionResponse, { id: string; answer: string; userId: string }>({
      query: ({ id, answer, userId }) => ({
        url: `/questions/${id}/answers`,
        method: "PATCH",
        body: { answer, userId },
      }),
      invalidatesTags: ["Questions"],
      onQueryStarted: async ( _id , { dispatch, queryFulfilled }) => {
        updateQuestionCacheAfterResponse(dispatch, queryFulfilled);
      }
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetQuestionByIdQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useResponseToQuestionMutation,
} = questionApi;