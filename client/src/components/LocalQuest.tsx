import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import QuestCard from '../components/QuestCard';
import LocalMap from '../components/LocalMap';

export const LocalQuestContainer = styled.section`

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

  .listOptions {
    font-weight: normal;
    font-size: 1rem;
    display: flex;
    justify-content: space-between;
    margin: 15px 0;

    .filter {
      display: flex;

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

  @media screen and (max-width: 699px) {

    .listOptions{
      flex-direction: column-reverse;
      margin: 7px 0;

      .filter {
        margin-top: 5px;
      }
    }
  }
`;

type Props = {
  location: string,
  localParty: Array<{ [key: string]: any }>
};

export default function LocalQuest ({ location, localParty }: Props) {
  const [partyList, setPartyList] = useState(localParty.map(local => local).reverse());
  const [checked, setChecked] = useState({ online: true, offline: true });

  function checkboxHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if((checked.online || event.target.checked) && (checked.offline || event.target.checked)) {
      setChecked({ ...checked, [event.target.id]: event.target.checked });
    }
  }

  useEffect(() => {
    if (checked.online && checked.offline) setPartyList(localParty.map(local => local).reverse());
    else if (checked.online) setPartyList(localParty.filter(local => local.isOnline).reverse());
    else setPartyList(localParty.filter(local => !local.isOnline).reverse())
  }, [checked]);

  return (
    <LocalQuestContainer>
      <header className="listHeader">
          내 주변의 퀘스트
          <div className="listOptions">
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
            {checked.offline?
              <div>
                <b>현재 위치:</b> {location}
              </div>
            : null}
          </div>
         
        </header> 
        {checked.offline ? <LocalMap location={location} localParty={localParty.filter(local => !local.isOnline)} /> : null}
        {partyList.map((party, idx) => <QuestCard key={idx} party={party} />)}
    </LocalQuestContainer>
  );
}
