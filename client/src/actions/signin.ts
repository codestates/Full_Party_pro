import axios from "axios";
import { Dispatch } from 'redux'
import { cookieParser } from "../App";
import { CLOSE_MODAL } from "./modalType";
import { UserInfoDispatchType, SIGNIN_SUCCESS, SIGNIN_FAIL } from "./signinType";

export const fetchUserdata = (userInfo: object) => async (dispatch: Dispatch<UserInfoDispatchType>) => {
  // const response = await axios.post(`${process.env.REACT_APP_API_URL}/signin`, userInfo, {
  //   withCredentials:true
  // });
  // const payload = response.data.userInfo;
  document.cookie = "signupType=general";
  document.cookie = `location=${process.env.REACT_APP_CLIENT_URL}/home`;
  document.cookie = "isLoggedIn=1;"
  
  // if(response.status === 200) {
  //   dispatch({
  //     type: SIGNIN_SUCCESS,
  //     payload
  //   })
  //   dispatch({
  //     type: CLOSE_MODAL
  //   })
  // }
  // else if(response.status === 401) {
  //   dispatch({
  //     type: SIGNIN_FAIL
  //   })
  // }
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