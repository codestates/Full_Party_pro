import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import styled from 'styled-components';
import { AppState } from '../reducers';
import { NOTIFY } from '../actions/notify';

import Loading from '../components/Loading';
import PartySlide from '../components/PartySlide';
import LocalQuest from '../components/LocalQuest';
import EmptyCard from '../components/EmptyCard';

// [dev] 더미데이터: 서버 통신되면 삭제
import dummyList from '../static/dummyList';

export const ListContainer = styled.div`
  width: 100%;
  height: 100%;

  margin: 70px 0 60px 0;
  padding: 20px 25px;

  section.listSection {

    margin-bottom: 20px;

    header.listHeader {
      font-size: 1.7rem;
      font-weight: bold;

      margin-bottom: 10px;

      main {
        display: flex;
        justify-content: center;
      }
    } 
  }
`

export default function List () {

  const dispatch = useDispatch();

  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLoggedIn
  );

  const userInfo = useSelector(
    (state: AppState) => state.signinReducer.userInfo
  );

  const searchRegion = userInfo.address.split(" ")[0] + " " + userInfo.address.split(" ")[1];

  // [dev] 더미데이터
  // const { userInfo, myParty, localParty } = dummyList;

  const [isLoading, setIsLoading] = useState(true);
  const [ myParty, setMyParty ] = useState([]);
  const [ localParty, setLocalParty ] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/list/${userInfo.id}/${searchRegion}`, {
        withCredentials: true
      });
      setMyParty(response.data.myParty);
      setLocalParty(response.data.localParty);
      dispatch({
        type: NOTIFY,
        payload: {
          isBadgeOn: response.data.notification
        }
      });
      console.log(response.data);
    })();
    setIsLoading(false);
  }, [])

  if(!isLoggedIn){
    return <Navigate to="/" />
  } else if(isLoading) {
    return <Loading />
  }

  return (
    <ListContainer>
      {myParty.length > 0 ?
        <section className="listSection">
          <header className="listHeader">
            내 파티의 최근 소식
          </header>
          <main>
            <PartySlide myParty={myParty} />
          </main>
        </section>
      : null}
      {localParty.length > 0 ?
        <LocalQuest location={userInfo.address} localParty={localParty} />
        : <EmptyCard from="list" />}
    </ListContainer>
  );
}
