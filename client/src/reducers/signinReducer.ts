import { SIGNIN_FAIL, SIGNIN_SUCCESS, UserInfo, UserInfoDispatchType } from "../actions/signinType";

interface InitialState {
  isLogin?: boolean | null
  userInfo?: UserInfo
}

const initialState: InitialState = {
  isLogin: false,
  userInfo: {
    id: 0,
    userName: "",
    profileImage: "",
    region: "",
    signupType: ""
  }
}

const signinReducer = (state = initialState, action: UserInfoDispatchType): InitialState => {
  switch (action.type) {
    case SIGNIN_FAIL:
      return {
        ...state,
        isLogin: false
      }

    case SIGNIN_SUCCESS:
      const { id, userName, profileImage, region, signupType } = action.payload
      console.log(action.payload)
      return {
        ...state,
        isLogin: true,
        userInfo: {
          id,
          userName,
          profileImage,
          region,
          signupType
        }
      }


    default:
      return state;
  }
}

export default signinReducer;