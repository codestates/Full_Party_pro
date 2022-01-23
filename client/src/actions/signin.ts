import axios from "axios";
import { Dispatch } from 'redux'
import { CLOSE_MODAL } from "./modalType";
import { UserInfoDispatchType, SIGNIN_SUCCESS, SIGNIN_FAIL } from "./signinType";

export const fetchUserdata = (userInfo: object) => async (dispatch: Dispatch<UserInfoDispatchType>) => {
  document.cookie = "signupType=general";
  document.cookie = `isLoggedIn=1; domain=${process.env.REACT_APP_COOKIE_DOMAIN}; path=/;`;
  await axios.post(`${process.env.REACT_APP_API_URL}/signin`, userInfo, {
    withCredentials:true
  })
  .then((res) => {
    if(res.status === 200) {
      dispatch({
        type: SIGNIN_SUCCESS,
        payload: res.data.userInfo
      })
      dispatch({
        type: CLOSE_MODAL
      })
    }
  })
  .catch((err) => {
    if(err.response.status === 401) {
      dispatch({
        type: SIGNIN_FAIL
      })
    }
  })

}