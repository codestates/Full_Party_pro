import { SIGNIN_FAIL, SIGNIN_SUCCESS, UserInfo, UserInfoDispatchType } from "../actions/signinType";

interface InitialState {
  isLoggedIn?: boolean | null
  userInfo: UserInfo
}

const initialState: InitialState = {
  isLoggedIn: false,
  userInfo: {
    id: 0.1,
    userName: "Teo",
    profileImage: "https://teo-img.s3.ap-northeast-2.amazonaws.com/1_Don't+die.jpeg",
    address: "서울특별시 노원구 월계로45길 21",
    signupType: "general"
  }
}

const signinReducer = (state = initialState, action: UserInfoDispatchType): InitialState => {
  switch (action.type) {
    case SIGNIN_FAIL:
      return {
        userInfo: {
          id: 0,
          userName: "",
          profileImage: "",
          address: "",
          signupType: "",
        },
        isLoggedIn: false
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


    default:
      return state;
  }
}

export default signinReducer;