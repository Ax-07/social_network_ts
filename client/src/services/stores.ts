import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import localStorage from "redux-persist/lib/storage";
// import storageSession from "redux-persist/lib/storage/session";
import { postApi } from "./api/postApi";
import { UserApi } from "./api/userApi";
import { commentApi } from "./api/commentApi";
import { authApi } from "./auth/authApi";
import { googleAuthApi } from "./auth/googleAuthApi";
import { bookmarkApi } from "./api/bookmarkApi";
import authSlice from "./auth/authSlice";
import notificationSlice from "./notifications/notificationSlice";
import modalSlice from "./modals/modalSlice";
import formSlice from "./forms/formSlice";
import messageSlice from "./stores/messageSlice";
import { messagesApi } from "./api/messagesApi";
import { notificationApi } from "./api/notificationApi";
import { conversationsApi } from "./api/conversationsApi";

const persistConfig = {
    key: "root",
    //storage: storageSession, // Use session storage
    storage: localStorage, // Use local storage
};

const persistedAuthSlice = persistReducer(persistConfig, authSlice);

const store = configureStore({
    reducer: {
        [postApi.reducerPath]: postApi.reducer,
        [UserApi.reducerPath]: UserApi.reducer,
        [commentApi.reducerPath]: commentApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [googleAuthApi.reducerPath]: googleAuthApi.reducer,
        [bookmarkApi.reducerPath]: bookmarkApi.reducer,
        auth: persistedAuthSlice,
        notifications: notificationSlice,
        modals: modalSlice,
        form: formSlice,
        messages: messageSlice,
        [notificationApi.reducerPath]: notificationApi.reducer,
        [messagesApi.reducerPath]: messagesApi.reducer,
        [conversationsApi.reducerPath]: conversationsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            postApi.middleware, 
            UserApi.middleware, 
            commentApi.middleware, 
            authApi.middleware, 
            googleAuthApi.middleware, 
            notificationApi.middleware,
            bookmarkApi.middleware,
            messagesApi.middleware,
            conversationsApi.middleware,
        ),
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
