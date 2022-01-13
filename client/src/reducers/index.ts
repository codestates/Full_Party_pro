import { combineReducers } from 'redux';
import userReducer from './userReducer';
import signinReducer from './signinReducer';
import modalReducer from './modalReducer';
import searchReducer from './searchReducer'
import notifyReducer from './notifyReducer';

const rootReducer = combineReducers({
  userReducer,
  signinReducer,
  modalReducer,
  searchReducer,
  notifyReducer,
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;