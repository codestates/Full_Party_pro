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

  .emptyMsg {
    margin: 20px 0;
    font-size: 1.1rem;
    color: #777;
  }
`

export default function Favorite () {

  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLogin
  );

  const [isLoading, setIsLoading] = useState(true);

  const [favoriteList, setFavoriteList] = useState<Array<Object>>([]);

  useEffect(() => {
    // [dev]
    // api call: 관심파티 리스트 GET 요청
    
    // [dev] 더미데이터로 렌더링한 코드
    const fav = dummyList.localParty.filter((party) => party.favorite);
    setFavoriteList(fav);
    setIsLoading(false);
  }, [])

  if(!isLoggedIn){
    return <Navigate to="/" />
  } else if(isLoading){
    return <Loading />
  }

  return (
    <FavoriteContainer>
      <header className="favoriteHeader">
        내가 관심있는 퀘스트
      </header>
      {favoriteList.length > 0 ?
        favoriteList.map((party, idx) => <QuestCard key={idx} party={party} />)
      : <div className="emptyMsg">아직 관심 설정한 퀘스트가 없습니다.</div>}
    </FavoriteContainer>
  );
}
