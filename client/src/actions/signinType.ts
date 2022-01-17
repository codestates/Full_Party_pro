export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS'
export const SIGNIN_FAIL = 'SIGNIN_FAIL'

export type UserInfo = {
  id: number
  userName: string
  profileImage: string
  region: string
  signupType: string
}

export interface signinFailDispatch{
  type: typeof SIGNIN_FAIL
}

export interface signinSuccessDispatch {
  type: typeof SIGNIN_SUCCESS
  payload: UserInfo
}

export type UserInfoDispatchType = signinFailDispatch | signinSuccessDispatch