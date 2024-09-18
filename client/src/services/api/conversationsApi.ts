import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../stores";
import { ConversationResponseArray } from "../../utils/types/conversations.types";

const localUrl = "http://localhost:8080/api";

export const conversationsApi = createApi({
    reducerPath: "conversationsApi",
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
    tagTypes: ["Conversations"],
    endpoints: (build) => ({
        getConversationsByUserId: build.query<ConversationResponseArray, string>({
            query: (userId) => `/conversations/${userId}`,
            providesTags: (result) =>
              result && Array.isArray(result.data)
                ? [
                    ...result.data.map(({ id }) => ({ type: "Conversations" as const, id })),
                    { type: "Conversations", id: "LIST" },
                  ]
                : [{ type: "Conversations", id: "LIST" }],
        }),
    }),
    });

export const { useGetConversationsByUserIdQuery } = conversationsApi;