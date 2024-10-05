import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InventoryData {
    ItemCount: number;
    ItemType: string;
}

interface InventoryState {
    inventory: Array<InventoryData>;
    timestamp: number;
}

const initialState: InventoryState = {
    inventory: [],
    timestamp: 0,
};

const inventorySlice = createSlice({
  name: "inventoryScreen",
  initialState,
  reducers: {
    setInventory(state, action: PayloadAction<Array<InventoryData>>) {
      if (action.payload) {
        state.inventory = action.payload;
      }
      state.timestamp = Date.now();
    },
  },
});

export const { setInventory } = inventorySlice.actions;

export default inventorySlice.reducer;