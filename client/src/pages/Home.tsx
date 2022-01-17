import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppState } from '../reducers';
import { useEffect } from 'react';
import axios from 'axios';
import signinReducer from '../reducers/signinReducer';
import { UserInfoDispatchType, SIGNIN_SUCCESS, SIGNIN_FAIL } from "../actions/signinType";

export const HomeContainer = styled.div`
  width: 100%;
  height: 100%;

  margin: 60px 0;
`

function Home () {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(
    (state: AppState) => state.userReducer.isLoggedIn
  );

  useEffect(() => {
    if (new URL(window.location.href).searchParams.get("code") ) handleKakaoLogin();
    
  }, []);

  const handleKakaoLogin = async () => {
    const authorizationCode = new URL(window.location.href).searchParams.get("code");
    const response = await axios.post("https://localhost:443/kakao", { authorizationCode });
    dispatch({
      type: SIGNIN_SUCCESS,
      payload: response.data
    });
    console.log(response);
  };

  if(isLoggedIn){
    return <Navigate to="/list" />
  }

  return (
    <HomeContainer>
      <div>홈</div>
    </HomeContainer>
  );
}


export default Home;