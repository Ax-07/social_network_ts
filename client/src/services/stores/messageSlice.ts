import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../../utils/types/message.types";

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    initRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    initMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action) => {
      const { id, ...rest } = action.payload;
      const index = state.messages.findIndex((message) => message.id === id);
      if (index !== -1) {
        state.messages[index] = { ...state.messages[index], ...rest };
      }
    },
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload
      );
    },
  },
});

export const { initMessages, initRoomId, addMessage, updateMessage, deleteMessage } = messageSlice.actions;
export default messageSlice.reducer;