import { SIGNIN_FAIL, SIGNIN_SUCCESS, UserInfo, UserInfoDispatchType } from "../actions/signinType";

interface InitialState {
  isLoggedIn?: boolean | null
  userInfo: UserInfo
}

const initialState: InitialState = {
  isLoggedIn: true,
  userInfo: {
    id: 1,
    userName: '귀오미',
    profileImage: 'https://static.wikia.nocookie.net/animalcrossing/images/2/29/Molly_NH.png',
    region: '경기도 수원시',
    signupType: "general"
  }
}

const signinReducer = (state = initialState, action: UserInfoDispatchType): InitialState => {
  switch (action.type) {
    case SIGNIN_FAIL:
      return {
        ...state,
        isLoggedIn: false
      }

    case SIGNIN_SUCCESS:
      const { id, userName, profileImage, region, signupType } = action.payload
      return {
        ...state,
        isLoggedIn: true,
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