import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../reducers';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMapMarkerAlt, faCalendarAlt, faGlobe, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { faHeart as blankFaHeart } from "@fortawesome/free-regular-svg-icons";
import axios from 'axios';
import { useSelector } from 'react-redux';
import signinReducer from '../reducers/signinReducer';

export const QuestCardContainer = styled.div`
  width: 100%;
  height: 100%; 

  margin: 20px 0;
  padding: 20px;
  
  border-radius: 30px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

  cursor: pointer;

  header.questHeader {
    display: flex;
    justify-content: space-between;
    /* align-items: center; */

    font-size: 1.2rem;
    font-family: 'silkScreenBold';

    margin-bottom: 10px;

    .rightWrapper {
      display: flex;

      button.tag {
        max-width: 100px;

        height: 20px;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        background-color: #fff;
        border: none;
        color: #777;

        margin: 0 2px;
      }

      @media screen and (max-width: 540px) {
        button.tag {
          max-width: 50px;
        }
      }
    }
  }

  .favorite {

    margin: 0 5px;
    margin-left: 5px;

    font-size: 1.2rem;

    color: #fa3e7d;
    background-color: #fff;
    border-radius: 100%;
    border: none;
  }
`

export const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #d5d5d5;

  .infoHeader {
    display: flex;
  }
  
  .leaderProfile {
    width: 50px;
    height: 50px;
    border: 1px solid #d5d5d5;
    border-radius: 100%;

    margin-right: 10px;
  }

  .infoContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .icon {
      margin-right: 2px;
    }

    .title {
      font-size: 1.1rem;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .details {
      display: flex;

      color: #777;
      font-size: 0.9rem;

      .location {
        margin-right: 10px;
      }
    }

    @media screen and (max-width: 450px) {
      .details {
        flex-direction: column;

        margin-bottom: 5px;

        .location {
          margin-bottom: 5px;
        }
      }
    }
  }
`

export const MemberWrapper = styled.div`
  .label {
    font-size: 0.8rem;
    margin-bottom: 7px;
  }

  .memberContainer {
    display: flex;

    .memberProfile {
      width: 28px;
      height: 28px;
      border: 1px solid #d5d5d5;
      border-radius: 100%;

      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 5px;
    }

    .wanted {
      font-size: 9pt;
      color: #000;
      background-color: #d5d5d5;
    }

    @media screen and (min-width: 450px) {
      .memberProfile {
        width: 35px;
        height: 35px;
        margin-right: 7px;
      }
    }
  }
`

type Props = {
  party: {[key: string]: any},
}

export default function QuestCard ({ party }: Props) {

  const navigate = useNavigate();
  const { id, name, memberLimit, startDate, endDate, leaderId, favorite, tag, isOnline, location, members } = party;
  const userId = useSelector(
    (state: AppState) => state.signinReducer.userInfo.id
  );
  const [ like, setLike ] = useState(favorite);

  const formatDate = (date: Date) => String(date).slice(0, 11);

  const favoriteHandler = async (event: React.MouseEvent<HTMLDivElement>) => {
    // [dev] 서버 통신 후에는 setIsFavorite 삭제하기
    event.stopPropagation();
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/favorite/${id}`, { userId, partyId: id }, {
      withCredentials: true
    });
    if (response.data.message === "Like selected") setLike(true);
    else if (response.data.message === "Like canceled") setLike(false);
  }
  
  return (
    <QuestCardContainer 
      onClick={() => navigate(`../party/${id}`)}
      // style={{background: 
      //   isOnline ? 
      //   "linear-gradient(to bottom, #50C9C3 19%, #fff 10%)"
      //   : "linear-gradient(to bottom, #50C9C3 19%, #fff 10%)"
      // }}
    >
      <header className="questHeader">
        <div>
          Quest 
        </div>
        <div className="rightWrapper">
          <div className="tagContainer">
            { tag.map((t: string, idx: number) => 
              <button 
                key={idx} 
                className="tag" 
              >
                #{t}
              </button>
            )}
          </div>
          <div onClick={(e) => favoriteHandler(e)}>
            <FontAwesomeIcon 
              icon={like ? faHeart : blankFaHeart} 
              className="favorite"
            /> 
          </div>  
        </div>
      </header>

      <main>
        <InfoWrapper>
          <div className="infoHeader">
            <div 
              className="leaderProfile"
              style={{ backgroundImage: `url(${members[0].profileImage})`, backgroundSize: "cover" }} 
            />
            <div className="infoContainer">
              <div className="title">
                {name}
              </div>
              <div className="details">
                <div className="location">
                  {isOnline ?
                    <><FontAwesomeIcon icon={ faGlobe } className="icon" /> 온라인 퀘스트</>
                    : <><FontAwesomeIcon icon={ faMapMarkerAlt } className="icon" /> {location.split(" ")[1] + " " + location.split(" ")[2]}</>
                  }
                </div>
                <div className="time">
                  <FontAwesomeIcon icon={ faCalendarAlt } className="icon" /> {formatDate(startDate)} ~ {formatDate(endDate)}   
                </div>
              </div>
            </div>
          </div>
        </InfoWrapper>

        <MemberWrapper>
          <div className="label">
            참여중인 파티원({members.length}/{memberLimit})
          </div>
          <div className="memberContainer">
            {members.map((member: { id: number, profileImage: string }, idx: number) => {
              if(member.id !== leaderId){
                return (
                  <div 
                    key={idx}
                    className="memberProfile"
                    style={{ backgroundImage: `url(${member.profileImage})`, backgroundSize: "cover" }} 
                  />
                )
              }
            })}
            {[...Array(memberLimit - members.length)].map((n, idx) => 
              <div key={idx} className="memberProfile wanted">
                <FontAwesomeIcon icon={ faExclamation } />
              </div>
            )}
          </div>
        </MemberWrapper>  
      </main>

    </QuestCardContainer>
  );
}