import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styled from 'styled-components';

export const PartyContainer = styled.div`
  width: 100%;
  height: 100%;

  padding: 60px 0;
`

export default function Party () {

  const isLoggedIn = useSelector(
    ({ userReducer }) => userReducer.isLoggedIn
  );

  if(!isLoggedIn){
    return <Navigate to="/" />
  }

  return (
    <PartyContainer>
      <div>파티창</div>
    </PartyContainer>
  );
}
