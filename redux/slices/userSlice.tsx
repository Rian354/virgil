import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: "",
  email: "",
  isDarkMode: false,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    user: (state) => {
      state.id = state.id;
      state.name = state.name;
      state.email = state.email;
      state.isLoggedIn = state.isLoggedIn;
      state.isDarkMode = state.isDarkMode;
    },
  },
});

export const { user } = userSlice.actions;
export default userSlice.reducer;