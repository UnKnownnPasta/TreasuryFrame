import { combineReducers } from "@reduxjs/toolkit";
import relic from "../../screens/background/stores/prime";
import inventory from "../../screens/background/stores/inventory";
import rewards from "../../screens/ingame/stores/rewards";
import itemData from "../../screens/background/stores/data";

const rootReducer = combineReducers({
  rewards,
  inventory,
  relic,
  itemData
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default rootReducer;
