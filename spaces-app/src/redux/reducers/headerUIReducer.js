import { createSlice } from '@reduxjs/toolkit';

const headerUIReducer = createSlice({
    name: 'logInOut',
    initialState: 
    {current:'HOME',
    stack:['HOME']},
    reducers: {
        setHeaderUI: (state, action) => {
        state.stack.push(action.payload);
        state.current = action.payload;
        },
        goBack: (state) => {
          if (state.stack.length > 1) {
              state.stack.pop();
              state.current = state.stack[state.stack.length - 1];
          }
      }
    },
});

export const { setHeaderUI,goBack } = headerUIReducer.actions;
export default headerUIReducer.reducer;

