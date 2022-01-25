import { NOTIFY } from "../actions/notify";

const initialState = { isBadgeOn: false };

const notifyReducer = (state = initialState, action: { type: string; payload: { isBadgeOn: boolean }; }) => {
  switch (action.type) {
    case NOTIFY:
      return { isBadgeOn: action.payload.isBadgeOn };

    default:
      return state;
  }
};

export default notifyReducer;