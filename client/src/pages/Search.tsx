import React from 'react';

import styled from 'styled-components';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../reducers';

export const SearchContainer = styled.div`
  width: 100%;
  height: 100%;

  margin: 60px 0;
`

export default function Search () {

  const isLoggedIn = useSelector(
    (state: AppState) => state.userReducer.isLoggedIn
  );

  if(!isLoggedIn){
    return <Navigate to="/" />
  }

  return (
    <SearchContainer>
      <div>검색창</div>
    </SearchContainer>
  );
}
