export const MODIFY_USERINFO = 'MODIFY_USERINFO'
export const SIGNIN_FAIL = 'SIGNIN_FAIL'
export const CLOSE_MODAL = 'CLOSE_MODAL'

export type UserInfo = {
  userName: string
  profileImage: string
  address: string,
}

export interface modifyUserInfoDispatch {
  type: typeof MODIFY_USERINFO
  payload: UserInfo
}

export type ModifyUserInfoDispatchType = modifyUserInfoDispatch