import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../stores";
import {
  MessageResponse,
  MessageResponseArray,
} from "../../utils/types/message.types";

const localUrl = "http://localhost:8080/api";

export const messagesApi = createApi({
  reducerPath: "messagesApi",
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
  tagTypes: ["Messages"],
  endpoints: (build) => ({
    getMessages: build.query<MessageResponseArray, void>({
      query: () => "/messages",
      providesTags: (result) =>
        result && Array.isArray(result.data)
          ? [
              ...result.data.map(({ id }) => ({
                type: "Messages" as const,
                id,
              })),
              { type: "Messages", id: "LIST" },
            ]
          : [{ type: "Messages", id: "LIST" }],
    }),
    getMessagesByRoomId: build.query<MessageResponseArray, string>({
      query: (roomId) => `/messages/${roomId}`,
      providesTags: (_result, _error, roomId) => [{ type: "Messages", roomId }],
    }),
    addMessage: build.mutation<MessageResponse, FormData>({
      query: (formData) => ({
        url: `/messages`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Messages"],
    }),
    addMessage2: build.mutation<MessageResponse, FormData>({
      query: (formData) => ({
        url: `/messages2`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useAddMessageMutation,
  useGetMessagesByRoomIdQuery,
  useAddMessage2Mutation,
} = messagesApi;
