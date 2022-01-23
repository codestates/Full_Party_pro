import { Dispatch } from 'redux'
import { IsModalDispatchType, SIGNIN_MODAL, SIGNUP_MODAL, CLOSE_MODAL } from "./modalType";

export const modalChanger = (className: string) => (dispatch: Dispatch<IsModalDispatchType>) => {
  if (className === 'closeModalBtn') {
    dispatch({
      type: CLOSE_MODAL
    });
  }
  else if (className === 'signinModalBtn') {
    dispatch({
      type: SIGNIN_MODAL
    });
  }
  else if (className === 'signupModalBtn') {
    dispatch({
      type: SIGNUP_MODAL
    });
  }
}