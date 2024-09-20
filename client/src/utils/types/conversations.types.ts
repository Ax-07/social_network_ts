import { MessageTypes } from "./message.types";
import { User } from "./user.types";

export interface ConversationTypes {
  id: number;
  adminId: number;
  userId: number;
  roomId: string;
  createdAt: string;
  updatedAt: string;
  admin: User;
  user: User;
  messages: MessageTypes[];
}

export interface ConversationResponse {
  status: string;
  data: ConversationTypes;
  message: string;
}

export interface ConversationResponseArray {
  status: string;
  data: ConversationTypes[];
  message: string;
}
