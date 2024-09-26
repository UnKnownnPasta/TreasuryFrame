import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RewardState {
    rewards: string;
    playerCount: number;
}

const initialState: RewardState = {
    rewards: "",
    playerCount: 0,
};

const rewardsSlice = createSlice({
  name: "rewardScreen",
  initialState,
  reducers: {
    setRewards(state, action: PayloadAction<string>) {
      state.rewards = action.payload;
    },

    setPlayerCount(state, action: PayloadAction<number>) {
      state.playerCount = action.payload;
    },
  },
});

export const { setRewards, setPlayerCount } = rewardsSlice.actions;

export default rewardsSlice.reducer;