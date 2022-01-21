import { SIGNIN_FAIL, SIGNIN_SUCCESS, UserInfo, UserInfoDispatchType } from "../actions/signinType";
import { MODIFY_USERINFO, ModifyUserInfoDispatchType } from "../actions/modify";

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
    signupType: ""
  }
}

const signinReducer = (state = initialState, action: UserInfoDispatchType | ModifyUserInfoDispatchType): InitialState => {
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
        }
      }

    case SIGNIN_SUCCESS:
      const { id, userName, profileImage, address, signupType } = action.payload
      return {
        ...state,
        isLoggedIn: true,
        userInfo: {
          id,
          userName,
          profileImage,
          address,
          signupType
        }
      }

    // [dev] 추가한 액션
    case MODIFY_USERINFO:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          userName,
          profileImage,
          address,
        }
      }  
      
    default:
      return state;
  }
}

export default signinReducer;