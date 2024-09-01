export interface NotificationTypes {
    id: string;
    userId: string;
    senderId: string;
    type: string;
    message: string;
    isRead: boolean;
    postId?: string;
    commentId?: string;
    createdAt?: string;
  }

  export interface NotificationsState {
    notifications: NotificationTypes[];
  }
  
  export const initialState: NotificationsState = {
    notifications: [],
  };

  export interface NotificationsResponseArray {
    status: string;
    data: NotificationTypes[];
    message: string;
}