import { createSlice } from '@reduxjs/toolkit';

const roundEndedReducer = createSlice({
    name: 'roundEnded',
    initialState: false,
    reducers: {
        setRoundEnded: (state, action) => action.payload,
    },
});

export const { setRoundEnded } = roundEndedReducer.actions;
export default roundEndedReducer.reducer;

