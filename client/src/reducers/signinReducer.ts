import exp from "constants";
import { SIGNIN_FAIL, SIGNIN_SUCCESS, UserInfo, UserInfoDispatchType } from "../actions/signinType";

interface InitialState {
  isLoggedIn?: boolean | null
  userInfo: UserInfo
}

const initialState: InitialState = {
  isLoggedIn: null,
  userInfo: {
    id: 0.1,
    userName: "",
    profileImage: "https://teo-img.s3.ap-northeast-2.amazonaws.com/defaultProfile.png",
    address: "",
    signupType: "",
    exp: 0,
    level: 0
  }
}

const signinReducer = (state = initialState, action: UserInfoDispatchType): InitialState => {
  switch (action.type) {
    case SIGNIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        userInfo: {
          id: 0,
          userName: "",
          profileImage: "",
          address: "",
          signupType: "",
          exp: 0,
          level: 0
        }
      }

    case SIGNIN_SUCCESS:
      const { id, userName, profileImage, address, signupType, exp, level } = action.payload
      return {
        ...state,
        isLoggedIn: true,
        userInfo: {
          id,
          userName,
          profileImage,
          address,
          signupType,
          exp,
          level
        }
      }
      
    default:
      return state;
  }
}

export default signinReducer;