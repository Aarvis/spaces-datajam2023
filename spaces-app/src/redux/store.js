import { configureStore } from '@reduxjs/toolkit';
import logInOutReducer from './reducers/logInOutReducer';
import headerUIReducer from './reducers/headerUIReducer';
import scoreboardReducer from './reducers/scoreboardReducer';
import eventTimelineReducer from './reducers/eventTimelineReducer';
import lineWidthReducer from './reducers/lineWidthReducer';
import maxWidthReachedReducer from './reducers/maxWidthReachedReducer';
import receivedDotsReducer from './reducers/receivedDotsReducer';
import roundEndedReducer from './reducers/roundEndedReducer';
import roundStartedReducer from './reducers/roundStartedReducer';

const store = configureStore({
  reducer: {
    logInOutReducer: logInOutReducer,
    headerUIReducer:headerUIReducer,
    scoreboardReducer: scoreboardReducer,
    eventTimelineReducer: eventTimelineReducer,
    roundStartedReducer:roundStartedReducer,
    roundEndedReducer:roundEndedReducer,
    receivedDotsReducer:receivedDotsReducer,
    maxWidthReachedReducer:maxWidthReachedReducer,
    lineWidthReducer:lineWidthReducer,
  },
});

export default store;
