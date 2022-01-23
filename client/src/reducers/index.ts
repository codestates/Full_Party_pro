import signinReducer from './signinReducer';
import modalReducer from './modalReducer';
import notifyReducer from './notifyReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  signinReducer,
  modalReducer,
  notifyReducer,
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;