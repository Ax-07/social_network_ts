import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, NotificationTypes } from '../../utils/types/notification.types';
import { mergeNotifications } from '../../pages/notifications/functions/mergeNotifications';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    initNotifications: (state, action: PayloadAction<NotificationTypes[]>) => {
      state.notifications = mergeNotifications(action.payload, state.notifications);
    },
    addNotification: (state, action: PayloadAction<NotificationTypes>) => {
      // Fusionner les nouvelles notifications reçues via WebSocket avec celles déjà dans l'état
      state.notifications = mergeNotifications([action.payload], state.notifications);
    },
    updateNotificationStatus(state, action: PayloadAction<{ ids: string[]; isRead: boolean }>) {
      state.notifications = state.notifications.map((notif) =>
        action.payload.ids.includes(notif.id) ? { ...notif, isRead: action.payload.isRead } : notif
      );
    },
  },
});

export const { initNotifications, addNotification, updateNotificationStatus } = notificationSlice.actions;
export default notificationSlice.reducer;
