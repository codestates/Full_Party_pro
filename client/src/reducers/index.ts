import { combineReducers } from 'redux';
import userReducer from './userReducer';
import signinReducer from './signinReducer';

const rootReducer = combineReducers({
  userReducer,
  signinReducer,
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;