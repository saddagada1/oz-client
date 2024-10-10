import { themes, themesRGBA } from "@/lib/constants";
import { Theme } from "@/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Pallette {
  foreground: string;
  background: string;
  accent: string;
  brand: string;
  white: string;
  black: string;
}

interface PalletteRGBA {
  foreground: number[];
  background: number[];
  accent: number[];
  brand: number[];
  white: number[];
  black: number[];
}

interface ThemeState {
  colors: Pallette;
  colorsRGBA: PalletteRGBA;
  theme: Theme;
}

const initialState: ThemeState = {
  colors: themes["light"],
  colorsRGBA: themesRGBA["light"],
  theme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      (state.colors = themes[action.payload]),
        (state.colorsRGBA = themesRGBA[action.payload]),
        (state.theme = action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
