import React, { useState, useEffect } from 'react';
import { cookieParser } from "../App"
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { AppState } from '../reducers';
import Loading from '../components/Loading';
import QuestCard from '../components/QuestCard';
import axios from 'axios';
import { NOTIFY } from "../actions/notify"

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
  const dispatch = useDispatch();
  const userInfo = useSelector(
    (state: AppState) => state.signinReducer.userInfo
  );
  const userId = useSelector(
    (state: AppState) => state.signinReducer.userInfo.id
  );
  
  const [ isLoading, setIsLoading ] = useState(true);
  const [ favoriteList, setFavoriteList ] = useState<Array<Object>>([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/favorite/${userId}`, {
        withCredentials: true
      });
      dispatch({
        type: NOTIFY,
        payload: {
          isBadgeOn: response.data.notification
        }
      });
      setFavoriteList(response.data.partyList);
    })();
  }, [ userInfo ]);

  useEffect(() => {
    setIsLoading(false);
  }, [ favoriteList ]);

  if(cookieParser().isLoggedIn === "0"){
    return <Navigate to="../" />
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
