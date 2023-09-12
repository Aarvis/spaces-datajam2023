import { createSlice } from '@reduxjs/toolkit';

const scoreboardReducer = createSlice({
    name: 'scoreboard',
    initialState: null,
    reducers: {
        setScoreboard: (state, action) => action.payload,
    },
});

export const { setScoreboard } = scoreboardReducer.actions;
export default scoreboardReducer.reducer;

