import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RelicState {
  relics: Array<SheetRelicData>;
  parts: Array<SheetPartData>;
}

const initialState: RelicState = {
  relics: [],
  parts: [],
};

const relicSlice = createSlice({
  name: "relicScreen",
  initialState,
  reducers: {
    setRelic(state, action: PayloadAction<Array<SheetRelicData>>) {
      state.relics = action.payload;
    },
    setPart(state, action: PayloadAction<Array<SheetPartData>>) {
      state.parts = action.payload;
    },
  },
});

export const { setRelic, setPart } = relicSlice.actions;

export default relicSlice.reducer;