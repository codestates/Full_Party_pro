import { combineReducers } from 'redux';
import userReducer from './userReducer';
import signinReducer from './signinReducer';
<<<<<<< HEAD
import modalReducer from './modalReducer';
import searchReducer from './searchReducer'
=======
import notifyReducer from './notifyReducer';
>>>>>>> 1b30b02dc9de3d61ef2aeadb6bc9314bbac1fad6

const rootReducer = combineReducers({
  userReducer,
  signinReducer,
<<<<<<< HEAD
  modalReducer,
  searchReducer
=======
  notifyReducer,
>>>>>>> 1b30b02dc9de3d61ef2aeadb6bc9314bbac1fad6
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;