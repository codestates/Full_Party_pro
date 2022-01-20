import { SIGNIN_FAIL, SIGNIN_SUCCESS, UserInfo, UserInfoDispatchType } from "../actions/signinType";

interface InitialState {
  isLoggedIn?: boolean | null
  userInfo: UserInfo
}

const initialState: InitialState = {
  isLoggedIn: true,
  userInfo: {
    id: 0.1,
    userName: "",
    profileImage: "",
    address: "대전시 어쩌구",
    signupType: ""
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