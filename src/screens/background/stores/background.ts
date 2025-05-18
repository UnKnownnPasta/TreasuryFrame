import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { processInventoryData } from "../../../api";

// OVERWOLF TYPINGS
interface Timestamp { timestamp: number; }
type OwInfo =
  | overwolf.games.events.InfoUpdates2Event
  | overwolf.games.InstalledGameInfo;
type InfoPayload = PayloadAction<Timestamp & OwInfo>;

// WARFARME TYPINGS
type itemObject = {
  "ItemType": string;
  "ItemCount": number;
}

interface RelicReward {
  item: string;
  x2: boolean;
  stock: number;
  color: string;
  rarity: number;
  relicFrom: string;
}

interface translatedRelicInfo {
  uniqueName: string;
  processedName: string;
  description: string;
  inventoryCount: number;
  name?: string;
  rewards?: RelicReward[];
  tokens?: number;
  vaulted?: boolean;
} 

interface BackgroundState {
  rawData: {
    inventory: string | null;
    logs: Array<Array<any>>;
  };
  parsedData: {
    infos: Array<itemObject>;
    translatedRelicInfo: translatedRelicInfo[];
    translatedPrimeInfo: Object[];
  };
}

const initialState: BackgroundState = {
  rawData: {
    inventory: null,
    logs: [] as Array<Array<any>>,
  },
  parsedData: {
    infos: [] as itemObject[],
    translatedRelicInfo: [] as translatedRelicInfo[],
    translatedPrimeInfo: [] as Object[],
  },
};

// Create async thunk for processing inventory
export const processInventoryThunk = createAsyncThunk(
  'backgroundScreen/processInventory',
  async (inventory: itemObject[]) => {
    await processInventoryData(inventory);
  }
);

const backgroundSlice = createSlice({
  name: "backgroundScreen",
  initialState,
  reducers: {
    setRawInventoryData(state, action: InfoPayload) {
      // @ts-ignore - Extract String
      state.rawData.inventory = action.payload.info.match_info["inventory"];
    },
    setRawLogData(state, action: PayloadAction<Array<any>>) {
      state.rawData.logs.push(action.payload);
    },
    parseInventoryData(state) {
      if (!state.rawData.inventory) return;

      let infoObject;
      try {
        infoObject = JSON.parse(state.rawData.inventory);
      } catch (e) {
        const gameInfoStr = state.rawData.inventory
          .replace(/\\/g, '')
          .replace(/}","/g, '},"')
          .replace(/}]}","/g, '}]},"')
          .replace(/":"{"/g, '":{"');
        infoObject = JSON.parse(gameInfoStr);
      }

      state.parsedData.infos = infoObject['MiscItems'];
    },
    setTranslatedRelicInfo(state, action: PayloadAction<translatedRelicInfo>) {
      state.parsedData.translatedRelicInfo.push(action.payload);
    },
    setTranslatedPrimeInfo(state, action: PayloadAction<Object>) {
      state.parsedData.translatedPrimeInfo.push(action.payload);
    },
  },
});

export const { 
  setRawInventoryData, 
  setRawLogData,
  parseInventoryData, 
  setTranslatedRelicInfo, 
  setTranslatedPrimeInfo 
} = backgroundSlice.actions;

export default backgroundSlice.reducer;
