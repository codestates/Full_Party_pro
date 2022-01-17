import { combineReducers } from 'redux';
import signinReducer from './signinReducer';
import modalReducer from './modalReducer';
import searchReducer from './searchReducer'
import notifyReducer from './notifyReducer';

const rootReducer = combineReducers({
  signinReducer,
  modalReducer,
  searchReducer,
  notifyReducer,
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;