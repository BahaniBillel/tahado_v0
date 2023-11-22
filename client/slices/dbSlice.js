import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  db: [],
};

export const dbSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    addData: (state, action) => {
      const item = state.db.find((item) => item.id === action.payload.id);
      if (item) {
        return;
      } else {
        state.db = [...state.db, action.payload];
      }
      return item;
    },
  },
});

export const { addData } = dbSlice.actions;

// this how we pull items from the global store
export const selectDB = (state) => state.database.db;

export default dbSlice.reducer;
