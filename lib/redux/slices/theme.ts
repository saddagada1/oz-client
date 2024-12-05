import { themes } from "@/lib/constants";
import { Theme } from "@/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Pallette {
  foreground: string;
  background: string;
  accent: string;
  brand: string;
  destructive: string;
  success: string;
  white: string;
  black: string;
}

interface ThemeState {
  colors: Pallette;
  theme: Theme;
}

const initialState: ThemeState = {
  colors: themes["light"],
  theme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      (state.colors = themes[action.payload]), (state.theme = action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
