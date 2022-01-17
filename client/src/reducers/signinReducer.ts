import { SIGNIN_FAIL, SIGNIN_SUCCESS, UserInfo, UserInfoDispatchType } from "../actions/signinType";

interface InitialState {
  success?: boolean | null
  accessToken: string
  userInfo?: UserInfo
}

const initialState: InitialState = {
  success: null,
  accessToken: "",
  userInfo: {
    id: 0,
    name: '김리덕스',
    userImage: '김리덕스프사',
    region: '노원구',
    accessToken: ""
  }
}

const signinReducer = (state = initialState, action: UserInfoDispatchType): InitialState => {
  switch (action.type) {
    case SIGNIN_FAIL:
      return {
        ...state,
        accessToken: "",
        success: false
      }

    case SIGNIN_SUCCESS:
      const { id, name, userImage, region, accessToken } = action.payload
      return {
        ...state,
        success: true,
        userInfo: {
          id,
          name,
          userImage,
          region,
          accessToken
        }
      }


    default:
      return state;
  }
}

export default signinReducer;