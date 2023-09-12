import { createSlice } from '@reduxjs/toolkit';

const receivedDotsReducer = createSlice({
    name: 'receivedDots',
    initialState: [],
    reducers: {
        setReceivedDots: (state, action) => action.payload,
    },
});

export const { setReceivedDots } = receivedDotsReducer.actions;
export default receivedDotsReducer.reducer;

