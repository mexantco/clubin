import { createSlice } from "@reduxjs/toolkit";

const clubs = createSlice({
  name: "clubs",
  initialState: {clubs:[]},
  reducers: {
    setClubs: (state, action) => {
      state.clubs = action.payload.clubs;
      
    },
  },
});

export const setClubs = clubs.actions.setClubs;
export default clubs.reducer;
