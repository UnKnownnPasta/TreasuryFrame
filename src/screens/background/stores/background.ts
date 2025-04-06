import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Timestamp {
  timestamp: number;
}
type OwInfo =
  | overwolf.games.events.InfoUpdates2Event
  | overwolf.games.InstalledGameInfo;
type InfoPayload = PayloadAction<Timestamp & OwInfo>;
interface BackgroundState {
  infos: Array<Object>;
  parsedStateInfos: Array<Object>;
}

const initialState: BackgroundState = {
  infos: [] as Array<Object>,
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

      state.infos = infoObject['MiscItems'];
    },
    setParsedStateInfo(state, action: PayloadAction<Object>) {
      state.parsedStateInfos.push(action.payload);
    },
  },
});

export const { setInfo, setParsedStateInfo } = backgroundSlice.actions;

export default backgroundSlice.reducer;
