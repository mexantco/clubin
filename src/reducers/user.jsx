import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload.userData;
    },
  },
});

export const setUserData = user.actions.setUserData;
export default user.reducer;
