import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { AppState } from '../reducers';

import Loading from '../components/Loading';
import QuestCard from '../components/QuestCard';

// [dev] 더미데이터: 서버 통신되면 삭제
import dummyList from '../static/dummyList';

export const FavoriteContainer = styled.div`
  width: 100%;
  height: 100%;

  margin: 70px 0;
  padding: 20px 30px;

  header.favoriteHeader {
    font-size: 1.7rem;
    font-weight: bold;
  }
`

export default function Favorite () {

  const isLoggedIn = useSelector(
    (state: AppState) => state.userReducer.isLoggedIn
  );

  const [isLoading, setIsLoading] = useState(true);

  //[dev] 더미데이터로 렌더링한 것. 서버 통신 되면 삭제.
  const favoriteList = dummyList.localParty.filter((party) => party.favorite);

  useEffect(() => {
    // [dev]
    // api call: 관심파티 리스트 GET 요청
    setIsLoading(false);
  }, [])

  if(!isLoggedIn){
    return <Navigate to="/" />
  }

  if(favoriteList.length <= 0){
    //[dev] 없을 때 렌더링
    return (<div>관심파티가 없어용</div>)
  }

  return (
    <FavoriteContainer>
      <header className="favoriteHeader">
        내가 관심있는 퀘스트
      </header>
      {favoriteList.map((party, idx) => <QuestCard key={idx} party={party} />)}
    </FavoriteContainer>
  );
}
