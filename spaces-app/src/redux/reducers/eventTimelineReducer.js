import { createSlice } from '@reduxjs/toolkit';

const eventTimelineReducer = createSlice({
    name: 'event',
    initialState: null,
    reducers: {
        setEvent: (state, action) => action.payload,
    },
});

export const { setEvent } = eventTimelineReducer.actions;
export default eventTimelineReducer.reducer;

