import { combineReducers } from 'redux';
import userReducer from './userReducer';
import signinReducer from './signinReducer';
import modalReducer from './modalReducer';
import searchReducer from './searchReducer'

const rootReducer = combineReducers({
  userReducer,
  signinReducer,
  modalReducer,
  searchReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;