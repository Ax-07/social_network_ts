import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../stores";
import { BookmarkResponseArray } from "../../utils/types/bookmark.types";
import { UserResponse } from "../../utils/types/user.types";
import { updateBookmarkCacheAfterAddToBookmarks } from "../utils/bookmarkApiHelper";

const localUrl = "http://localhost:8080/api";

export const bookmarkApi = createApi({
    reducerPath: "bookmarkApi",
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
    tagTypes: ["Bookmarks"],
    endpoints: (builder) => ({
      getBookmarks: builder.query<BookmarkResponseArray, string>({
        query: (userId) => `/users/${userId}/bookmarks`,
        providesTags: (result) =>
          result && Array.isArray(result.data)
            ? [
                ...result.data.map(({ id }) => ({ type: "Bookmarks" as const, id })),
                { type: "Bookmarks", id: "BOOKMARKS" },
              ]
            : [{ type: "Bookmarks", id: "BOOKMARKS" }],
      }),
      toggleBookmark: builder.mutation<UserResponse, { userId: string; postId?: string; commentId?: string }>({
        query: ({ userId, postId, commentId }) => ({
          url: `/users/${userId}/bookmarks`,
          method: "PATCH",
          body: { userId, postId, commentId },
        }),
        onQueryStarted: async ({ userId, postId, commentId }, { dispatch, queryFulfilled }) => {
          updateBookmarkCacheAfterAddToBookmarks(userId, { dispatch, queryFulfilled }, postId, commentId);
        },
      }),
    }),
  });

  export const { useGetBookmarksQuery, useToggleBookmarkMutation } = bookmarkApi;
