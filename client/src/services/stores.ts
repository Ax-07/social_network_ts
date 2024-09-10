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
import authSlice from "./auth/authSlice";
import notificationSlice from "./notifications/notificationSlice";
import modalSlice from "./modals/modalSlice";
import formSlice from "./forms/formSlice";
import { notificationApi } from "./api/notificationApi";

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
        auth: persistedAuthSlice,
        notifications: notificationSlice,
        modals: modalSlice,
        form: formSlice,
        [notificationApi.reducerPath]: notificationApi.reducer,
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
            notificationApi.middleware
        ),
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
