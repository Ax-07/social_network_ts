import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState, NotificationTypes } from "../../utils/types/notification.types";

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<NotificationTypes>) {
      state.notifications = [...state.notifications, action.payload];
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
