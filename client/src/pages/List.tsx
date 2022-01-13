import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { AppState } from '../reducers';

import Loading from '../components/Loading';
import PartySlide from '../components/PartySlide';
import QuestCard from '../components/QuestCard';
import LocalMap from '../components/LocalMap';

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

      .filter {
        font-weight: normal;
        font-size: 1rem;

        display: flex;
        margin-top: 10px;

        .options {
          margin-right: 10px;
        }

        input[type="checkbox"] {
           display: none;
        }

        .icon {
          margin-right: 8px;
        }
      }
    } 
  }
`

export default function List () {

  const isLoggedIn = useSelector(
    (state: AppState) => state.userReducer.isLoggedIn
  );

  const { myParty, localParty } = dummyList;

  const [isLoading, setIsLoading] = useState(true);
  const [partyList, setPartyList] = useState(localParty.map(local => local).reverse());
  const [checked, setChecked] = useState({ online: true, offline: true });

  function checkboxHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if((checked.online || event.target.checked) && (checked.offline || event.target.checked)){
      setChecked({ ...checked, [event.target.id]: event.target.checked });
    }
  }

  useEffect(() => {
    // [dev]
    // api call: 파티 정보 불러오기
    setIsLoading(false);
  }, [])

  useEffect(() => {
    if(checked.online && checked.offline){
      setPartyList(localParty.map(local => local).reverse());
    } else if(checked.online){
      setPartyList(localParty.filter(local => local.isOnline).reverse());
    } else {
      setPartyList(localParty.filter(local => !local.isOnline).reverse())
    }
  }, [checked])

  if(!isLoggedIn){
    return <Navigate to="/" />
  } else if(isLoading) {
    return <Loading />
  }

  return (
    <ListContainer>
      <section className="listSection">
        <header className="listHeader">
          내 파티의 최근 소식
        </header>
        <main>
          {myParty.length <= 0 ? 
            "[dev] 파티 없을 때 렌더링 필요"
          :  <PartySlide myParty={myParty} /> }
        </main>
      </section>
      <section className="listSection">
        <header className="listHeader">
          내 주변의 퀘스트
          <div className="filter">
            <div className="options">
              <input 
                type="checkbox"
                id="online"
                checked={checked.online}
                onChange={checkboxHandler}
              /> 
              <label htmlFor="online">
                <FontAwesomeIcon 
                  icon={ checked.online? faCheckSquare : faSquare } 
                  style={{ color: "#50C9C3" }}
                  className="icon"
                />온라인 퀘스트
              </label>
            </div>
            <div className="options">
              <input 
                type="checkbox" 
                id="offline"
                checked={checked.offline}
                onChange={checkboxHandler}
              /> 
              <label htmlFor="offline">
                <FontAwesomeIcon 
                  icon={ checked.offline? faCheckSquare : faSquare } 
                  style={{ color: "#50C9C3" }}
                  className="icon"
                />오프라인 퀘스트
              </label> 
            </div>
          </div>
        </header>
        {/* {checked.offline ? <LocalMap localParty={localParty.filter(local => !local.isOnline)} /> : null} */}
        {/* [dev] 로컬 파티 없을 때 렌더링 */}
        {localParty.length <= 0 ? 
          "[dev] 파티 없을 때 렌더링 필요"
        : <>
            {partyList.map((party, idx) => <QuestCard key={idx} party={party} />)}
          </>  
        }
      </section>
    </ListContainer>
  );
}
