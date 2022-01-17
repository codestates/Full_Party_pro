import { SIGNIN_FAIL, SIGNIN_SUCCESS, UserInfo, UserInfoDispatchType } from "../actions/signinType";

interface InitialState {
  isLogin?: boolean | null
  userInfo?: UserInfo
}

const initialState: InitialState = {
  isLogin: null,
  userInfo: {
    id: 0,
    name: '김리덕스',
    userImage: '김리덕스프사',
    region: '노원구'
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
      const { id, name, userImage, region } = action.payload
      return {
        ...state,
        isLogin: true,
        userInfo: {
          id,
          name,
          userImage,
          region
        }
      }


    default:
      return state;
  }
}

export default signinReducer;