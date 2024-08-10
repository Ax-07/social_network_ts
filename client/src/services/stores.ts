import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { postApi } from "./api/postApi";
import { UserApi } from "./api/userApi";

const persistConfig = {
    key: "root",
    storage: storageSession,
};

const store = configureStore({
    reducer: {
        [postApi.reducerPath]: postApi.reducer,
        [UserApi.reducerPath]: UserApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(postApi.middleware, UserApi.middleware),
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export { store, persistor };