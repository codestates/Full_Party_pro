import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styled from 'styled-components';

export const PostContainer = styled.div`
  width: 100%;
  height: 100%;

  padding: 60px 0;
`

export default function Post () {

  const isLoggedIn = useSelector(
    ({ userReducer }) => userReducer.isLoggedIn
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
