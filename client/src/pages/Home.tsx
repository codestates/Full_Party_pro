import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppState } from '../reducers';

export const HomeContainer = styled.div`
  width: 100%;
  height: 100%;

  margin: 60px 0;
`

function Home () {

  const isLoggedIn = useSelector(
    (state: AppState) => state.userReducer.isLoggedIn
  );

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