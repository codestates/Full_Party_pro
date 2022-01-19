import { NOTIFY } from "../actions/notify";
// import { initialState } from "./initialState";

// let user = JSON.parse(localStorage.getItem('user'));
// const initialState = user ? { isLoggedIn: true, user } : { isLoggedIn: false };

// interface keyable {
//   [key: string]: any  
// }

const initialState = { isBadgeOn: true };

function notifyReducer(state = initialState, action: { type: string; payload: { isBadgeOn: boolean }; }) {

  switch (action.type) {
    case NOTIFY:
      //TODO
      return { isBadgeOn: action.payload.isBadgeOn };

    default:
      return state;
  }
}

export default notifyReducer;