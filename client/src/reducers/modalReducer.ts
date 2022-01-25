import { SIGNIN_MODAL, SIGNUP_MODAL, CLOSE_MODAL, IsModalDispatchType } from "../actions/modalType";

interface InitialState {
  isModal: boolean;
  modalType: string;
};

const initialState: InitialState = {
  isModal: false,
  modalType: 'signin'
};

const modalReducer = (state = initialState, action: IsModalDispatchType): InitialState => {
  switch (action.type) {
    case SIGNIN_MODAL:
      return {
        ...state,
        isModal: true,
        modalType: 'signin'
      };

    case SIGNUP_MODAL:
      return {
        ...state,
        isModal: true,
        modalType: 'signup'
      };

    case CLOSE_MODAL:
      return {
        ...state,
        isModal: false,
        modalType: ''
      };

    default:
      return state;
  }
}

export default modalReducer;