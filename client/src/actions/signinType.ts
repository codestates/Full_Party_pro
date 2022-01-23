export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS'
export const SIGNIN_FAIL = 'SIGNIN_FAIL'
export const CLOSE_MODAL = 'CLOSE_MODAL'
// export const MODIFY_USERINFO = 'MODIFY_USERINFO'

export type UserInfo = {
  id: number
  userName: string
  profileImage: string
  address: string,
  signupType: string
}

export interface signinFailDispatch{
  type: typeof SIGNIN_FAIL
}

export interface signinSuccessDispatch {
  type: typeof SIGNIN_SUCCESS
  payload: UserInfo
}

export interface closeModalDispatch {
  type: typeof CLOSE_MODAL
}

export type UserInfoDispatchType = signinFailDispatch | signinSuccessDispatch | closeModalDispatch