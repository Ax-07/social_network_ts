import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../stores";
import { NotificationsResponseArray } from "../../utils/types/notification.types";

const localUrl = "http://localhost:8080/api";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
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
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getAllNotificationsByUserId: builder.query<NotificationsResponseArray, string>({
      query: (userId) => `/notifications/${userId}`,
      providesTags: ["Notifications"],
    }),
    removeNotification: builder.mutation<string, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
    updateNotifications: builder.mutation<string, {userId : string, notificationsIds: string }>({
      query: ({ userId, notificationsIds }) => ({
        url: `/notifications/${userId}/markAsRead`,
        method: "PATCH",
        body: { notificationsIds },
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetAllNotificationsByUserIdQuery,
  useRemoveNotificationMutation,
  useUpdateNotificationsMutation,
} = notificationApi;