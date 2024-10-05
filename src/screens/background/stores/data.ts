import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ItemData {
    ItemInternal: string;
    ItemPlayer: string;
}

interface ItemDataState {
    RelicArcanes: Array<ItemData>;
    PrimeData: Array<ItemData>;
}

const initialState: ItemDataState = {
    RelicArcanes: [],
    PrimeData: [],
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
    setPrimeData(state, action: PayloadAction<Array<ItemData>>) {
      if (action.payload) {
        state.PrimeData = action.payload;
      }
    },
  },
});

export const { setRelicArcanes, setPrimeData } = itemDataSlice.actions;

export default itemDataSlice.reducer;