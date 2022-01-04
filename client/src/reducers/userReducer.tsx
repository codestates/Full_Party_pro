import { LOGIN_USER, REGISTER_USER } from "../actions/index";
// import { initialState } from "./initialState";

// let user = JSON.parse(localStorage.getItem('user'));
// const initialState = user ? { isLoggedIn: true, user } : { isLoggedIn: false };

// interface keyable {
//   [key: string]: any  
// }

const initialState = { isLoggedIn: true };

function userReducer(state = initialState, action: { type: string; payload: object; }) {

  switch (action.type) {
    case LOGIN_USER:
      //TODO
      return { isLoggedIn: true };

      break;
    case REGISTER_USER:
      //TODO
      return { isLoggedIn: true };

      break;
    default:
      return state;
  }
}

export default userReducer;