import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Loading from '../components/Loading';
import { Navigate, Link } from 'react-router-dom';
import { NOTIFY } from "../actions/notify"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBullhorn, faScroll, faTrophy, faStar, faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../reducers';
import { cookieParser } from '../App';

export const NotificationContainer = styled.div`
  margin: 60px 0;

  .notificationList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    color: #000;
    border-bottom: 1px solid #d5d5d5;
    cursor: pointer;

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

      &.level, &.star, &.bell {
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
`;

export default function Notification() {
  const dispatch = useDispatch();
  const userId = useSelector(
    (state: AppState) => state.signinReducer.userInfo.id
  );

  const isBadgeOn = useSelector(
    (state: AppState) => state.notifyReducer.isBadgeOn
  );

  const [ notification, setNotification ] = useState<{ [key: string]: any }>([]);
  const [ isLoading, setIsLoading ] = useState(true);

  type messageType = {
    [index: string]: string
  };

  const message: messageType = {
    "apply": "?????? ???????????? ??????????????????.",
    "accept": "?????? ????????? ??????????????????.",
    "deny": "?????? ????????? ??????????????????.",
    "expel": "???????????? ?????????????????????.",
    "quit": "?????? ???????????? ??????????????????.",
    "favorite": "?????? ???????????? ????????? ????????????.",
    "complete": "???????????? ?????????????????????!",
    "fullparty": "????????? ????????? ??????????????????. ???????????? ??????????????????!",
    "reparty": "???????????? ?????????????????????.",
    "dismiss": "????????? ??????????????????.",
    "question": "?????? ????????? ????????? ??????????????????.",
    "answer": "????????? ????????? ?????? ????????? ??????????????????.",
    "reply": "?????? ????????? ?????? ???????????? ??????????????????.",
    "levelup": "??? ????????? ???????????????!",
    "leveldown": "??? ????????? ??????????????????."
  };

  const timeForToday = (value: Date) => {
    const today = new Date();
    const timeValue = new Date(value);

    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
    if (betweenTime < 1) return '?????? ???';
    if (betweenTime < 60) return `${betweenTime}??? ???`;

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) return `${betweenTimeHour}?????? ???`;

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) return `${betweenTimeDay}??? ???`;
    return `${Math.floor(betweenTimeDay / 365)}??????`;
  };

  useEffect(() => {
    if (userId !== 0.1) {
      setIsLoading(true);
      (async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/notification/${userId}`);
        dispatch({
          type: NOTIFY,
          payload: {
            isBadgeOn: response.data.notification
          }
        });
        setNotification(response.data.notifications);
      })();
    }
  }, [ userId ]);

  useEffect(() => {
    setIsLoading(false);
  }, [ notification ]);

  if (cookieParser().isLoggedIn === "0") return <Navigate to="../" />
  else if (isLoading) return <Loading />

  if (notification.length <= 0) {
    return (<NotificationContainer>
      <div className="notificationList">
        <div className="contentWrapper">
          <div className="iconContainer">
            <FontAwesomeIcon icon={ faBellSlash } className="icon bell"/>
          </div>
          <div className="titleContainer">
            <div className="partyNameContainer">
              <div>?????? ???????????? ????????????.</div>
            </div>
            <div>????????? ???????????? ???????????? ????????? ??????????????????!</div>
          </div>
        </div>
      </div>
    </NotificationContainer>)
  }

  return (
    <NotificationContainer>
      {notification.map((noti: {[key: string]: any}, idx: number) => {
        if (!noti.partyId) {
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
        }
        else if(noti.content === "dismiss") {
          return (
            <div key={idx} className="notificationList" style={{ background: noti.isRead? "#fff" : "rgb(80,201,195, 0.1)" }}>
              <div className="contentWrapper">
                <div className="iconContainer">
                  <FontAwesomeIcon icon={ faBullhorn } className="icon horn" />
                </div>
                <div className="titleContainer">
                  <div className="partyNameContainer">
                    [<div className="partyName">{noti.partyName}</div>]
                  </div>
                  <div className="content">{message[noti.content]}</div>
                </div>
              </div>
              <div className="time">{timeForToday(noti.createdAt)}</div>
            </div>
          );
        }
        else {
          return (
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
      }).reverse()}
    </NotificationContainer>
  );
}