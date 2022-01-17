import axios from "axios";
import { Dispatch } from 'redux'
import { UserInfoDispatchType, SIGNIN_SUCCESS, SIGNIN_FAIL } from "./signinType";

export const fetchUserdata = (userInfo: object) => async (dispatch: Dispatch<UserInfoDispatchType>) => {
  try {
    const res = await axios.post(`http://localhost:3000/signin`, userInfo)
    const data = res.data

    dispatch({
      type: SIGNIN_SUCCESS,
      payload: data
    })
  } catch(err) {
    dispatch({
      type: SIGNIN_FAIL
    })
  }
}