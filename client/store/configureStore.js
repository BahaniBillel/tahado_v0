import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../slices/basketSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "./storage";

import dbSlice from "../slices/dbSlice";
// import storage from "./storage";

// Redux Persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// Create the persisted reducer for the basket slice
const persistedBasketReducer = persistReducer(persistConfig, basketReducer);

// Configure the Redux store
const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

  reducer: {
    basket: persistedBasketReducer,
    database: dbSlice,
  },
});

// Create the Redux persistor
const persistor = persistStore(store);

export { store, persistor };
