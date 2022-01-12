import { combineReducers } from 'redux';
import userReducer from './userReducer';
import signinReducer from './signinReducer';
import notifyReducer from './notifyReducer';

const rootReducer = combineReducers({
  userReducer,
  signinReducer,
  notifyReducer,
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;