import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface IThemeState {
  theme: string;
}

const initialState: IThemeState = {
  theme: "light",
};

export const authSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = authSlice.actions;
export const selectTheme = (state: IThemeState) => state.theme;
export const themeReducer = authSlice.reducer;
