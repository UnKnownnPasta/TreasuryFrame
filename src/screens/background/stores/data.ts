import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ItemData {
    ItemInternal: string;
    ItemPlayer: string;
}

interface ItemDataState {
    RelicArcanes: Array<ItemData>;
    Warframes: Array<ItemData>;
    Weapons: Array<ItemData>;
}

const initialState: ItemDataState = {
    RelicArcanes: [],
    Warframes: [],
    Weapons: [],
};

const itemDataSlice = createSlice({
  name: "itemdataScreen",
  initialState,
  reducers: {
    setRelicArcanes(state, action: PayloadAction<Array<ItemData>>) {
      if (action.payload) {
        state.RelicArcanes = action.payload;
      }
    },
    setWarframes(state, action: PayloadAction<Array<ItemData>>) {
      if (action.payload) {
        state.Warframes = action.payload;
      }
    },
    setWeapons(state, action: PayloadAction<Array<ItemData>>) {
      if (action.payload) {
        state.Weapons = action.payload;
      }
    },
  },
});

export const { setRelicArcanes, setWarframes, setWeapons } = itemDataSlice.actions;

export default itemDataSlice.reducer;