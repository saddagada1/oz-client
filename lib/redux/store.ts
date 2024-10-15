import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import themeReducer from "./slices/theme";
import visionReducer from "./slices/vision";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    vision: visionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
