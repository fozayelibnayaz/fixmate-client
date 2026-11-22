import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth";
import ui from "./ui";

export const makeStore = () =>
  configureStore({
    reducer: { auth, ui },
  });

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
