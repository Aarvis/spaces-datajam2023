import { createSlice } from '@reduxjs/toolkit';

const lineWidthReducer = createSlice({
    name: 'lineWith',
    initialState: 0,
    reducers: {
        setLineWidth: (state, action) => action.payload,
    },
});

export const { setLineWidth } = lineWidthReducer.actions;
export default lineWidthReducer.reducer;

