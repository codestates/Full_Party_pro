import axios from "axios";
import { Dispatch } from 'redux'
import { UserInfoDispatchType, SIGNIN_SUCCESS, SIGNIN_FAIL } from "./signinType";

export const fetchUserdata = (userInfo: object) => async (dispatch: Dispatch<UserInfoDispatchType>) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/signin`, userInfo, {
      withCredentials: true
    });
    const payload = response.data.userInfo;
    document.cookie = "signupType=general";

    dispatch({
      type: SIGNIN_SUCCESS,
      payload
    })
  } catch(err) {
    dispatch({
      type: SIGNIN_FAIL
    })
  }
}