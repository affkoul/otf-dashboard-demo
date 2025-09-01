import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type State = {
  lastAddress?: string; // simple persisted memory
};

const initialState: State = {};

const slice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setLastAddress(state, action: PayloadAction<string | undefined>) {
      state.lastAddress = action.payload;
    },
  },
});

export const { setLastAddress } = slice.actions;
export default slice.reducer;
