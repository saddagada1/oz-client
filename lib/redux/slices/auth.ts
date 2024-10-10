import { Credentials, UserResponse } from "@/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  credentials: Credentials | null;
}

const initialState: AuthState = {
  status: "loading",
  credentials: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState(state, action: PayloadAction<AuthState>) {
      (state.status = action.payload.status), (state.credentials = action.payload.credentials);
    },
    setUser(state, action: PayloadAction<{ user: UserResponse }>) {
      if (!state.credentials) return;
      state.credentials = { ...state.credentials, user: action.payload.user };
    },
    setVerified(state, action: PayloadAction<boolean>) {
      if (!state.credentials) return;
      state.credentials = {
        ...state.credentials,
        user: { ...state.credentials.user, Verified: action.payload },
      };
    },
    incrementTotalProducts(state) {
      if (!state.credentials) return;
      state.credentials.user.TotalProducts += 1;
    },
    decrementTotalProducts(state) {
      if (!state.credentials) return;
      state.credentials.user.TotalProducts -= 1;
    },
    resetAuthState(state) {
      (state.status = "unauthenticated"), (state.credentials = initialState.credentials);
    },
  },
});

export const {
  setAuthState,
  setUser,
  setVerified,
  incrementTotalProducts,
  decrementTotalProducts,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
