import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { AppState } from '../reducers';

export const MypageContainer = styled.div`
  width: 100%;
  height: 100%;

  margin: 60px 0;
`

export default function Mypage () {

  const isLoggedIn = useSelector(
    (state: AppState) => state.userReducer.isLoggedIn
  );

  if(!isLoggedIn){
    return <Navigate to="/" />
  }

  return (
    <MypageContainer>
      <div>마이페이지</div>
      <div>{process.env.REACT_APP_TEST}</div>
      <div>{process.env.TEST}</div>
      <div>{process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY}</div>
      <div>{process.env.REACT_APP_CLIENT_URL}</div>
      {/* <div>{REACT_APP_TEST}</div> */}
    </MypageContainer>
  );
}
