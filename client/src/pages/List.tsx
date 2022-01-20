import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { cookieParser, requestKeepLoggedIn } from "../App";
import styled from 'styled-components';
import { AppState } from '../reducers';
import Loading from '../components/Loading';
import PartySlide from '../components/PartySlide';
import LocalQuest from '../components/LocalQuest';
import EmptyCard from '../components/EmptyCard';
import AddressModal from '../components/AddressModal';
import axios from 'axios';
import { NOTIFY } from '../actions/notify';
import { SIGNIN_SUCCESS } from '../actions/signinType';

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
  const [isLoading, setIsLoading] = useState(true);
  const [ myParty, setMyParty ] = useState([]);
  const [ localParty, setLocalParty ] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/list/${userInfo.id}/${searchRegion}`, {
        withCredentials: true
      });
      dispatch({
        type: NOTIFY,
        payload: {
          isBadgeOn: response.data.notification
        }
      });
      const parsedLocalParty = response.data.localParty.map((item: any) => ({ ...item, latlng: JSON.parse(item.latlng) }));
      setLocalParty(parsedLocalParty);
      setMyParty(response.data.myParty);
    })();
  }, [ userInfo ]);

  useEffect(() => {
    setIsLoading(false);
  }, [ localParty, myParty ]);

  if(isLoading) {
    return <Loading />
  }

  // if(!userInfo.address || userInfo.address === 'Guest'){
  //   return <AddressModal />
  // }

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