import { VisionHistoryItem } from "@/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface VisionState {
  history: VisionHistoryItem[];
  selectedIndex: number;
  isSubmitting: boolean;
}

const initialState: VisionState = {
  history: [],
  selectedIndex: 0,
  isSubmitting: false,
};

const visionSlice = createSlice({
  name: "vision",
  initialState,
  reducers: {
    setHistory(state, action: PayloadAction<VisionHistoryItem[]>) {
      state.history = action.payload;
    },
    setResultIndex(state, action: PayloadAction<number>) {
      state.history[state.selectedIndex].resultIndex = action.payload;
    },
    setSelectedIndex(state, action: PayloadAction<number>) {
      state.selectedIndex = action.payload;
    },
    setIsSubmitting(state, action: PayloadAction<boolean>) {
      state.isSubmitting = action.payload;
    },
  },
});

export const { setHistory, setResultIndex, setSelectedIndex, setIsSubmitting } =
  visionSlice.actions;

export default visionSlice.reducer;
