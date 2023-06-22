import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: 0,
};
// signoutUser();

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setCurrentTheme: (state, action) => {
      return { ...state, theme: action.payload };
    },
  },
});

export const { setCurrentTheme } = themeSlice.actions;
export default themeSlice.reducer;
