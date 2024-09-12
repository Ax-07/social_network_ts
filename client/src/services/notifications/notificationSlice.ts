import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, NotificationTypes } from '../../utils/types/notification.types';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<NotificationTypes>) {
      state.notifications.push(action.payload);
    },
    updateNotificationStatus(state, action: PayloadAction<{ ids: string[]; isRead: boolean }>) {
      state.notifications = state.notifications.map((notif) =>
        action.payload.ids.includes(notif.id) ? { ...notif, isRead: action.payload.isRead } : notif
      );
    },
  },
});

export const { addNotification, updateNotificationStatus } = notificationSlice.actions;
export default notificationSlice.reducer;
