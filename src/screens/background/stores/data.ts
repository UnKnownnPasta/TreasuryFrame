import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ItemDataState {
    RelicArcanes: Array<ItemData>;
    PrimeData: Array<ItemData>;
    ResourceData: Array<ItemData>;
}

const initialState: ItemDataState = {
    RelicArcanes: [],
    PrimeData: [],
    ResourceData: [],
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
    setResourceData(state, action: PayloadAction<Array<ItemData>>) {
      if (action.payload) {
        state.ResourceData = action.payload;
      }
    },
  },
});

export const { setRelicArcanes, setPrimeData, setResourceData } = itemDataSlice.actions;

export default itemDataSlice.reducer;