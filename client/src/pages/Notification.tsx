import React, { useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBullhorn, faScroll, faTrophy, faStar } from '@fortawesome/free-solid-svg-icons';

import { AppState } from '../reducers';

// [dev] 더미데이터: 서버 통신되면 삭제
import dummyNotification from '../static/dummyNotification';

export const NotificationContainer = styled.div`

  margin: 60px 0;

  .notificationList {

    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 15px 20px;

    color: #000;
    border-bottom: 1px solid #d5d5d5;

    .contentWrapper {
      display: flex;

      .iconContainer {
        height: 100%;
        padding-top: 0.5px;
      }

      .titleContainer {
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }

    .partyNameContainer {
      display: flex;
      font-weight: bold;

      margin-bottom: 5px;

      .partyName {
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .icon {
      font-size: 0.9rem;
      margin-right: 7px;

      &.horn {
        color: #b90e0a;
      }

      &.heart {
        color: #fa3e7d;
      }

      &.level, &.star {
        color: #f9c80a;
      }

      &.scroll {
        color: #a1785c;
      }
    }

    .content {
      word-break: keep-all;
    }

    .time {
      min-width: 50px;
      text-align: right;
      font-size: 0.8rem;
      color: #777;
    }
  }
`

export default function Notification () {

  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLogin
  );

  const isBadgeOn = useSelector(
    (state: AppState) => state.notifyReducer.isBadgeOn
  );

  // [dev] 더미데이터 코드 실제 데이터로 변경. 
  // 뒤에 map + reverse는 남겨둘것(최신순으로 배열하기 위해 배열 순서를 바꿈)
  const notification = dummyNotification.map(noti => noti).reverse();

  type messageType = {
    [index: string]: string
  }

  const message: messageType = {
    "apply": "님이 퀘스트에 지원했습니다.",
    "accept": "파티 가입이 승인됐습니다.",
    "deny": "파티 가입이 거절됐습니다.",
    "expel": "파티에서 추방당했습니다.",
    "quit": "님이 파티에서 탈퇴했습니다.",
    "favorite": "님이 퀘스트에 관심을 보입니다.",
    "complete": "퀘스트를 클리어했습니다!",
    "fullparty": "파티원 모집이 완료됐습니다. 퀘스트를 진행해보세요!",
    "reparty": "파티원을 재모집중입니다.",
    "dismiss": "파티가 해산됐습니다.",
    "question": "님의 퀘스트 문의가 도착했습니다.",
    "answer": "퀘스트 문의에 대한 답변이 도착했습니다.",
    "reply": "님의 답변에 대한 재문의가 도착했습니다.",
    "levelup": "로 레벨이 올랐습니다!"
  };

  function timeForToday(value: Date) {
    const today = new Date();
    const timeValue = new Date(value);

    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
    if (betweenTime < 1) return '방금 전';
    if (betweenTime < 60) {
        return `${betweenTime}분 전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
        return `${betweenTimeHour}시간 전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
        return `${betweenTimeDay}일 전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년전`;
  }

  useEffect(() => {
    // [dev]
    // isRead 상태 바꿔주는 요청
  }, [])

  if(!isLoggedIn){
    return <Navigate to="/" />
  }

  if(notification.length <= 0){
    return (<NotificationContainer>
      <div className="notificationList">
        <div className="contentWrapper">
          <div className="iconContainer">
            <FontAwesomeIcon icon={ faScroll } className="icon scroll" />
          </div>
          <div className="titleContainer">
            <div className="partyNameContainer">
              <div>아직 메시지가 없습니다.</div>
            </div>
            <div>주변의 퀘스트를 둘러보고 파티에 참여해보세요!</div> 
          </div> 
        </div>
        <div className="time">{timeForToday(new Date())}</div>
      </div>
    </NotificationContainer>)
  }

  return (
    <NotificationContainer>
      {notification.map((noti, idx) => {
        if(!noti.partyId){
          return (
            <Link to="/mypage" style={{ textDecoration: 'none' }} key={idx}>
              <div key={idx} className="notificationList" style={{ background: noti.isRead? "#fff" : "rgb(80,201,195, 0.1)" }}>
                <div>
                  <FontAwesomeIcon icon={ faTrophy } className="icon level" />
                  <span><strong>Lv.{noti.level}</strong>{message[noti.content]}</span>
                </div>
                <div className="time">{timeForToday(noti.createdAt)}</div>
              </div>
            </Link>
          );
        } else {
          return (
            //[dev] 파티 아이디로 링크 연결해야함
            <Link to={`/party/${noti.partyId}${noti.commentId ? `/${noti.commentId}` : ""}`} style={{ textDecoration: 'none' }} key={idx}>
              <div key={idx} className="notificationList" style={{ background: noti.isRead? "#fff" : "rgb(80,201,195, 0.1)" }}>
                <div className="contentWrapper">
                  <div className="iconContainer">
                    {noti.content === "favorite" ? <FontAwesomeIcon icon={ faHeart } className="icon heart" /> : null}
                    {noti.content === "complete" ? <FontAwesomeIcon icon={ faStar } className="icon star" /> : null }
                    {noti.content === "question" || noti.content === "answer"|| noti.content === "reply" ? <FontAwesomeIcon icon={ faScroll } className="icon scroll" /> : null }
                    {noti.content !== "favorite" && noti.content !== "complete" && noti.content !== "question" && noti.content !== "answer" && noti.content !== "reply" ?  
                      <FontAwesomeIcon icon={ faBullhorn } className="icon horn" /> 
                    : null}
                  </div>
                  <div className="titleContainer">
                    <div className="partyNameContainer">
                      [<div className="partyName">{noti.partyName}</div>]
                    </div>
                    <div className="content">{noti.userName? noti.userName : null}{message[noti.content]}</div> 
                  </div> 
                </div>
                <div className="time">{timeForToday(noti.createdAt)}</div>
              </div>
            </Link>   
          );
        }
      })}
    </NotificationContainer>
  );
}
