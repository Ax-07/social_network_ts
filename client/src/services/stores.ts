import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { postApi } from "./api/postApi";
import { UserApi } from "./api/userApi";
import { authApi } from "./auth/authApi";
import { googleAuthApi } from "./auth/googleAuthApi";
import authSlice from "./auth/authSlice";

const persistConfig = {
    key: "root",
    storage: storageSession,
}

const persistedAuthSlice = persistReducer(persistConfig, authSlice);

const store = configureStore({
    reducer: {
        [postApi.reducerPath]: postApi.reducer,
        [UserApi.reducerPath]: UserApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [googleAuthApi.reducerPath]: googleAuthApi.reducer,
        auth: persistedAuthSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(postApi.middleware, UserApi.middleware, authApi.middleware, googleAuthApi.middleware),
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export { store, persistor };