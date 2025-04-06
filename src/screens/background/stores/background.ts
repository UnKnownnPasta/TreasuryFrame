import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Timestamp {
  timestamp: number;
}
type OwInfo =
  | overwolf.games.events.InfoUpdates2Event
  | overwolf.games.InstalledGameInfo;
type InfoPayload = PayloadAction<Timestamp & OwInfo>;
type ParsedStateInfoData = {
  ItemName: string;
  ItemCount: number;
};
// payload type
type ParsedStateInfoPayload = PayloadAction<Timestamp & ParsedStateInfoData>;

interface BackgroundState {
  infos: Array<Timestamp & OwInfo>;
  parsedStateInfos: Array<ParsedStateInfoData>;
}

const initialState: BackgroundState = {
  infos: [],
  parsedStateInfos: [],
};

const backgroundSlice = createSlice({
  name: "backgroundScreen",
  initialState,
  reducers: {
    setInfo(state, action: InfoPayload) {
      // @ts-ignore - Extract String
      const gameInfo = action.payload.info.match_info["inventory"];
      let infoObject;
      try {
        infoObject = JSON.parse(gameInfo);
      } catch (e) {
        const gameInfoStr = gameInfo
          .replace(/\\/g, '')
          .replace(/}","/g, '},"')
          .replace(/}]}","/g, '}]},"')
          .replace(/":"{"/g, '":{"');
        infoObject = JSON.parse(gameInfoStr);
      }

      state.infos.push(infoObject);
    },
    setParsedStateInfo(state, action: ParsedStateInfoPayload) {
      state.parsedStateInfos.push(action.payload);
    },
  },
});

export const { setInfo, setParsedStateInfo } = backgroundSlice.actions;

export default backgroundSlice.reducer;
