import { createSlice } from '@reduxjs/toolkit';

const logInOutReducer = createSlice({
    name: 'logInOut',
    initialState: {logInId:null, type:null, status:'LOGGED_OUT'},
    reducers: {
      setLogInOut: (state, action) => action.payload,
    },
});

export const { setLogInOut } = logInOutReducer.actions;
export default logInOutReducer.reducer;

