import { createSlice } from '@reduxjs/toolkit';

const roundStartedReducer = createSlice({
    name: 'roundStarted',
    initialState: false,
    reducers: {
        setRoundStarted: (state, action) => action.payload,
    },
});

export const { setRoundStarted } = roundStartedReducer.actions;
export default roundStartedReducer.reducer;

