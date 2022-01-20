import React from 'react';
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router';
import axios from 'axios';
import { SIGNIN_SUCCESS } from '../actions/signinType';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

export const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;

  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  outline: none;
  z-index: 1000;
`;

export const LoadingBackdrop = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(255,255,255,0.8);

  padding-top: 40vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .text {
    font-family: 'SilkscreenBold';
    color: #50C9C3;
  }

  img {
    width: 50px;
    height: 50px;

    margin-bottom: 15px;
  }
`;

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const address = new URL(window.location.href).searchParams.get("code")
    if (address && address[1] !== "/") handleKakaoLogin();
    else if (address && address[1] === "/") handleGoogleLogin();
  }, []);

  const handleGoogleLogin = async () => {
    const authorizationCode = new URL(window.location.href).searchParams.get("code");
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/google`, { authorizationCode }, {
      withCredentials: true
    });
    dispatch({
      type: SIGNIN_SUCCESS,
      payload: response.data.userInfo
    });
    document.cookie = "signupType=google";
    document.cookie = `location=${process.env.REACT_APP_CLIENT_URL}/home`;
    document.cookie = "isLoggedIn=1;"
    navigate("../home");
  };

  const handleKakaoLogin = async () => {
    try {
      const authorizationCode = new URL(window.location.href).searchParams.get("code");
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/kakao`, { authorizationCode }, {
        withCredentials: true
      });
      dispatch({
        type: SIGNIN_SUCCESS,
        payload: response.data.userInfo
      });
      document.cookie = "signupType=kakao";
      document.cookie = `location=${process.env.REACT_APP_CLIENT_URL}/home;`;
      document.cookie = "isLoggedIn=1;"
      navigate("../home");
    }
    catch (error) {
      console.log(error);
    }
  };
  
  return (
    <LoadingContainer>
      <LoadingBackdrop>
        <img src="img/loadingLogo.gif" />
        <div className="text">Loading...</div>
      </LoadingBackdrop>
    </LoadingContainer>
  );
}
