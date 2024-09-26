import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type relicRewards = {
    item: string,
    stock: string,
    color: string,
}

interface RelicData {
  name: string;
  rewards: relicRewards[];
  tokens: string;
  vaulted: boolean;
}

interface PartData {
  item: string;
  stock: string;
}

interface RelicState {
  relics: Array<RelicData>;
  parts: Array<PartData>;
}

const initialState: RelicState = {
  relics: [],
  parts: [],
};

const relicSlice = createSlice({
  name: "relicScreen",
  initialState,
  reducers: {
    setRelic(state, action: PayloadAction<Array<RelicData>>) {
      state.relics = action.payload;
    },
    setPart(state, action: PayloadAction<Array<PartData>>) {
      state.parts = action.payload;
    },
  },
});

export const { setRelic, setPart } = relicSlice.actions;

export default relicSlice.reducer;