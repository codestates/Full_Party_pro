export const SIGNIN_MODAL = 'SIGNIN_MODAL'
export const SIGNUP_MODAL = 'SIGNUP_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'

export type IsModal = {
  isModal: boolean
  modalType: string
}

export interface signinModalDispatch{
  type: typeof SIGNIN_MODAL
}

export interface signupModalDispatch {
  type: typeof SIGNUP_MODAL
}

export interface closeModalDispatch {
  type: typeof CLOSE_MODAL
}

export type IsModalDispatchType = signinModalDispatch | signupModalDispatch | closeModalDispatch