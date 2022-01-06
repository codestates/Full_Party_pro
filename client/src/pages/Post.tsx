import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { AppState } from '../reducers';

export const PostContainer = styled.div`
  width: 100%;
  height: 100%;

  margin: 60px 0;
`

export default function Post () {

  const isLoggedIn = useSelector(
    (state: AppState) => state.userReducer.isLoggedIn
  );

  if(!isLoggedIn){
    return <Navigate to="/" />
  }
  
  return (
    <PostContainer>
      <div>파티 생성창</div>
    </PostContainer>
  );
}
