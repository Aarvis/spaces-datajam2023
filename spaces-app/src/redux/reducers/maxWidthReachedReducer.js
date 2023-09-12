import { createSlice } from '@reduxjs/toolkit';

const maxWidthReachedReducer = createSlice({
    name: 'maxWidthReached',
    initialState: false,
    reducers: {
        setMaxWidthReached: (state, action) => action.payload,
    },
});

export const { setMaxWidthReached } = maxWidthReachedReducer.actions;
export default maxWidthReachedReducer.reducer;

