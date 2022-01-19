import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShareAlt, faComments, faMapMarkerAlt, faCalendarAlt, faHeart, faAngleDown, faAngleUp, faBullhorn, faBirthdayCake, faCalendarCheck, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faHeart as blankFaHeart } from "@fortawesome/free-regular-svg-icons";

import Loading from '../components/Loading';
import UserInfoModal from '../components/UserInfoModal';
import PartyJoinModal from '../components/PartyJoinModal';
import SigninModal from '../components/SigninModal';
import ReviewModal from '../components/ReviewModal';
import PartyCancelModal from '../components/PartyCancelModal';

import PartyMap from '../components/PartyMap';
import MemberList from '../components/MemberList';
import QnA from '../components/QnA';

import { AppState } from '../reducers';

// [dev] 더미데이터: 서버 통신되면 삭제
import dummyParty from '../static/dummyParty';

export const PartyContainer = styled.div`

  margin: 60px 0 80px 0;

  button {
    cursor: pointer;

    &:disabled {
      color: black; 
    }
  }

  .favorite {
    color: #fa3e7d;
  }
`;

export const CVBtns = styled.div`
  position: fixed;

  width: 100%;
  padding: 20px;

  @media screen and (min-width: 1000px) {
    width: 70%;
  }

  .flexBox {
    display: flex;
    justify-content: space-between;
  }

  button {
    width: 45px;
    height: 45px;
    border-radius: 100%;

    background: rgba(255, 255, 255, 0.9);
    border: none;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

    font-size: 1.1rem;
  }

  .rightWrapper {
    button {
      margin-left: 10px;
    }
  }
`

export const Main = styled.section`
  section {
    margin-bottom: 10px;
  }

  header {
    .thumbnail {
      width: 100%;
      max-height: 50vh;
    }

    .titleContainer {

      width: 100%;

      margin: 20px 0;
      padding: 0 20px;

      #partyState {
        color: #777;
        margin-bottom: 5px;
      }

      .titleAndChat {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: 20pt;
        font-weight: bold;

        #title {
          display: flex;
          align-items: center;
          white-space: pre-wrap;

          max-width: 80%;
        }

        .privateLink {
          width: 50px;
          height: 50px;

          border: 1px solid #d5d5d5;
          border-radius: 100%;
          background-color: white;

          font-size: 1.2rem;
          color: #000;

          margin: 0 2vw;
        } 
      }
    }
  }

  .contentContainer {
    border-top: 1px solid #d5d5d5;

    .content {
      padding: 30px 30px 10px 30px;
      font-size: 1.2rem;
      line-height: 2rem;
    }
  }

  .mapDesc {
    padding: 0 30px;
    font-size: 0.8rem;
    color: #777;
  }
`

export const FavAndTag = styled.section`
  display: flex;
  justify-content: space-between;

  width: 100%;
  padding: 0 20px 20px 20px;

  .favoriteContainer {
    min-width: 60px;
    max-width: 80px;
    height: 30px;
    padding: 0 10px;

    border: 1px solid #d5d5d5;
    border-radius: 20px;
    background-color: white;
  }

  .tagContainer {
    display: flex;

    margin: 0 2vw;

    overflow-x: auto;

    .tag {
      max-width: 180px;

      height: 30px;
      padding: 0 10px;

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      background-color: #d5d5d5;
      border: none;
      border-radius: 20px;

      margin-left: 10px;
    }

    @media screen and (max-width: 699px) {

      max-width: 100%;

      .tag {
        max-width: 100px;
      }
    }
  }
`;

export const TimeandLocation = styled.section`
  padding: 0 30px;

  color: #777;

  a {
    text-decoration: none;
    color: #777;
  }

  .icon {
    margin-right: 8px;
  }

  .details {
    margin-bottom: 10px;
    margin-right: 15px;
    word-break: break-all;

    display: flex;
  }

  @media screen and (min-width: 650px) {
    .topWrapper {
      display: flex;
    }
  }
`;

export const MembersContainer = styled.section`

  border-top: 1px solid #d5d5d5;
  margin-top: 30px;

  .members {
    padding: 20px 20px 10px 20px;

    .label {
      font-size: 1.2rem;
      font-weight: bold;
    }
  }
`;

export const PartyStateBtns = styled.section`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  margin-top: 30px;

  .signinMsgContainer {
    font-size: 1.1rem;

    display: flex;
    flex-direction: column;
    align-items: center;

    #signin {
      width: 250px;
      height: 60px;
      border: none;
      box-shadow: rgba(80, 201, 195, 0.4) 0px 8px 24px;

      font-family: "silkScreenBold";
      font-size: 1.1rem;
      color: #50C9C3;

      margin-top: 25px;
      margin-bottom: 0;

      &:hover {
        background-color: #50C9C3;
        color: white;
      }
    }
  }

  button {
    min-width: 100px;
    height: 50px;

    border: 1px solid #d5d5d5;
    border-radius: 20px;
    background-color: white; 

    margin: 8px;
    padding: 10px 20px;
  }

  #completeBtn {
    color: white;
    background-color: #50C9C3; 
    border: none;
  }
`;

export default function Party () {

  const params = useParams();
  const navigate = useNavigate();
  const commentRef = useRef<HTMLElement>(null);

  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLoggedIn
  );

  const { Kakao } = window;

  // [dev] 유저 모달 메시지 수정 권한을 위해 임시로 설정한 유저 아이디, 나중에 리덕스에서 userId 불러오는 코드로 바꾸기
  const userId = 1;

  const { partyId, name, image, memberLimit, partyState, privateLink, content, region, startDate, endDate, favorite, tag, location, isOnline, isReviewed, leaderId, members, waitingQueue, comments } = dummyParty;

  // [dev] 서버와 연결되면 아래 코드는 삭제하고, 그 다음줄 주석을 활성화. 
  // 서버에서 관심 파티 등록되어있는지 여부 받아와야 함.
  const [isFavorite, setIsFavorite] = useState(false);
  // const { isFavorite } = dummyParty;

  const [isLoading, setIsLoading] = useState(true);

  const [isLeader, setIsLeader] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  //[dev] 모달 관련 코드 객체 하나로 합쳐보기
  // const [isModalOpen, setIsModalOpen] = useState({
  //   userInfoModal: false,
  //   partyJoinModal: false,
  //   signinModal: false,
  //   reviewModal: false,
  //   partyCancelModal: false,
  // })

  const [isWaitingListOpen, setIsWaitingListOpen] = useState(false);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [isPartyJoinModalOpen, setIsPartyJoinModalOpen] = useState(false);
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen]  = useState(false);
  const [isPartyCancelModalOpen, setIsPartyCancelModalOpen]  = useState(false);

  const [from, setFrom] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [findComment, setFindComment] = useState(-1);
  
  function formatDate(timestamp: Date){
    const date = timestamp.getDate();
    const month = timestamp.getMonth() + 1;
    const year = timestamp.getFullYear();

    return year + "/" + month + "/" + date;
  }

  function favoriteHandler(event: React.MouseEvent<HTMLButtonElement>) {
    // [dev] 서버 통신 후에는 setIsFavorite 삭제하기
    setIsFavorite(!isFavorite);
    console.log("관심파티를 등록합니다");  
  }

  function shareHandler(event: React.MouseEvent<HTMLButtonElement>) {

    const leader = members.filter((member) => member.id === leaderId)[0];
    const hashtags = tag.map((t) => `#${t}`).join(" ");

    Kakao.Link.sendDefault({
      objectType: 'feed',
      itemContent: {
        profileText: `${leader.name}님의 지원 요청!`,
        profileImageUrl: leader.profileImage, 
      },
      content: {
        title: `[퀘스트] ${name}`,
        description: `${content}\n ${hashtags}`,
        imageUrl: image,
        // [dev] url 파티 인덱스 포함한 path로 수정해야 합니다.
        link: {
          mobileWebUrl: `http://full-party-pro-bucket.s3-website.ap-northeast-2.amazonaws.com/party/${partyId}`,
          webUrl: `http://full-party-pro-bucket.s3-website.ap-northeast-2.amazonaws.com/party/${partyId}`,
        },
      },
      social: { 
        likeCount: favorite,
        subscriberCount: members.length 
      },
      buttonTitle: '퀘스트 참여하기'
    })
  }

  function tagSearchHandler(tag: string) {
    console.log(tag + "를 검색합니다.");
    navigate(`../search/tag/${tag}`);
  }

  function waitingListHandler(event: React.MouseEvent<HTMLDivElement>): void {
    setIsWaitingListOpen(!isWaitingListOpen);
  }

  function userInfoModalHandler(event: React.MouseEvent<HTMLDivElement>, from: string, listIdx: number): void {
   
    setFrom(from);
  
    if(from === "members") {
      setUserInfo(members[listIdx]);
    } else {
      setUserInfo(waitingQueue[listIdx]);
    }
    setIsUserInfoModalOpen(!isUserInfoModalOpen);
  }

  function partyJoinModalHandler(event: React.MouseEvent<HTMLButtonElement>): void {
    setIsPartyJoinModalOpen(!isPartyJoinModalOpen);
  }

  function signinModalHandler(event: React.MouseEvent<HTMLButtonElement>): void {
    setIsSigninModalOpen(!isSigninModalOpen);
  }

  function reviewModalHandler(event: React.MouseEvent<HTMLButtonElement>): void {
    setIsReviewModalOpen(!isReviewModalOpen);
  }

  function partyCancelModalHandler(event: React.MouseEvent<HTMLButtonElement>, from: string): void {
    setFrom(from);
    setIsPartyCancelModalOpen(!isPartyCancelModalOpen);
  }

  function cancelHandler(event: React.MouseEvent<HTMLButtonElement>) {
    // [dev]
    console.log("가입 신청을 취소합니다.");
  }

  function quitHandler(event: React.MouseEvent<HTMLButtonElement>) {
    // [dev]
    console.log("파티를 탈퇴합니다.");
  }

  function editHandler(event: React.MouseEvent<HTMLButtonElement>) {
    // [dev]
    console.log("현재 파티의 정보를 Props로 보내면서, 파티 생성창으로 이동합니다.");
  }

  function fullPartyHandler(event: React.MouseEvent<HTMLButtonElement>) {
    // [dev]
    console.log("파티 모집을 완료합니다");
  }

  function rePartyHandler(event: React.MouseEvent<HTMLButtonElement>) {
    // [dev]
    console.log("파티 모집을 재개합니다.");
  }

  function dismissHandler(event: React.MouseEvent<HTMLButtonElement>) {
    // [dev]
    console.log("파티를 해산합니다.");
  }

  useEffect(() => {
    // [dev]
    // params라는 변수에 파티 아이디가 저장되어있음.
    // api call: params로 파티 정보 불러오고, 리더, 멤버에 따라 상태 변경
    // then => 로딩 상태 false로
    if(params.commentId){
      setFindComment(Number(params.commentId));
      if(commentRef.current){
        commentRef.current.scrollIntoView();
      }
    }

    setIsLoading(false);
  }, [params])

  if(isLoading) {
    return <Loading />
  }

  return (
    <PartyContainer style={isLoggedIn ? {} : { marginBottom: "50px" }}>

      {/* 뒤로가기, 관심파티, 공유 버튼 */}
      <CVBtns>
        <div className="flexBox">
          <button onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={ faArrowLeft } className="icon" /> 
          </button>
          <div className="rightWrapper">
            {isLoggedIn?
              <button onClick={favoriteHandler}>
                <FontAwesomeIcon 
                  icon={isFavorite ? faHeart : blankFaHeart} 
                  className="favorite" 
                /> 
              </button>
            : null}
            <button onClick={shareHandler}>
              <FontAwesomeIcon icon={ faShareAlt } className="icon" />
            </button>  
          </div>  
        </div>
      </CVBtns>

      <Main>

        {/* 썸네일과 타이틀, 채팅방 링크 */}
        <header>
          <img src={image} className="thumbnail" alt="thumbnail" />
          <div className="titleContainer">
            <div id="partyState">
              {partyState === 0 ? 
                <>
                  <FontAwesomeIcon icon={ faBullhorn } /> 모집중 퀘스트
                </>
              : null}
              {partyState === 1 ?
                <>
                  <FontAwesomeIcon icon={ faBirthdayCake } /> 진행중 퀘스트
                </>
              : null}
              {partyState === 2 ? 
                <>
                  <FontAwesomeIcon icon={ faCalendarCheck } /> 완료된 퀘스트
                </>
              : null}
            </div>
            <div className="titleAndChat">
              <div id="title">{ name }</div>
              {isMember? 
                <button className="privateLink">
                  <a href={ privateLink } target="_blank" rel="noreferrer" style={{ color: "#000" }}>
                    <FontAwesomeIcon icon={ faComments } className="icon" />
                  </a>
                </button>
              : null}
            </div>
          </div>
        </header>

        {/* 관심 파티와 해쉬태그 */}
        <FavAndTag>
          <button className="favoriteContainer" 
            onClick={favoriteHandler}
            style={isLoggedIn ? { cursor: "pointer" } : { cursor: "default" }}
            disabled={!isLoggedIn}
          >
            <FontAwesomeIcon 
              icon={isFavorite ? faHeart : blankFaHeart}
              className="favorite" 
            />
            &nbsp;{ favorite }
          </button>
          <div className="tagContainer">
            { tag.map((t, idx) => 
              <button 
                key={idx} 
                className="tag" 
                onClick={() => tagSearchHandler(t)}
                style={isLoggedIn ? { cursor: "pointer" } : { cursor: "default" }}
                disabled={!isLoggedIn}
              >
                #{t}
              </button>
            )}
          </div>
        </FavAndTag>

        {/* 글 내용 */}
        <section className="contentContainer">
          <div className="content">
            { content }
          </div>
        </section>

        {/* 지역과 일정 */}
        <TimeandLocation>
          <div className="topWrapper">
            <div className="details">
              <div className="icon"><FontAwesomeIcon icon={ faMapMarkerAlt } /></div>
              { !isMember || isOnline ? region : location }
            </div>
            <div className="details">
              <div className="icon"><FontAwesomeIcon icon={ faCalendarAlt } /></div>
              { formatDate(startDate) } ~ { formatDate(endDate) }
            </div>
          </div>
          {isOnline ?
            <div className="details">
              <div className="icon"><FontAwesomeIcon icon={ faGlobe } /></div>
              {isMember? 
                <a href={location}>{location}</a>
              : "이 퀘스트는 온라인으로 진행되는 퀘스트입니다." }
            </div>
          : null}
        </TimeandLocation>

        {/* 지도 */}
        {!isOnline? 
          <div className="mapDesc">
            <PartyMap
              isMember={isMember}
              location={location}
              image={image}
            />  
            {!isMember? "파티원에게는 더 정확한 장소가 표시됩니다." : null}
          </div> 
        : null}

        {/* 파티원과 대기자 리스트 */}
        <MembersContainer>
          <div className="members">
            <div className="label">파티원 목록</div>
            <MemberList
              from="members"
              leaderId={leaderId}
              members={members}
              userInfoModalHandler={userInfoModalHandler}
            />
          </div>
        </MembersContainer>

        {isLeader && partyState <= 0 && memberLimit > members.length ? 
          <MembersContainer>
            <div className="members">
              <div className="label" onClick={waitingListHandler}>
                퀘스트 지원자&ensp;<FontAwesomeIcon icon={isWaitingListOpen? faAngleUp : faAngleDown} />
              </div> 
              {isWaitingListOpen ?
                <MemberList
                  from="waitingQueue"
                  leaderId={leaderId}
                  members={waitingQueue}
                  userInfoModalHandler={userInfoModalHandler}
                />
              : null}
            </div>
          </MembersContainer> 
        : null}

        {/* 문의 게시판 */}
        <section id="qna" ref={commentRef}>
          <QnA 
            partyId={partyId}
            isLeader={isLeader}
            leaderId={leaderId}
            comments={comments}
            findComment={findComment}
          /> 
        </section>
        
        <PartyStateBtns>
          {/* 비로그인 상태 */}
          {!isLoggedIn ?
            <div className="signinMsgContainer">
              <div className="signinMsg">
                <b>로그인</b>해서 이 파티의 회원이 되어보세요! 🥳
              </div>
              <button id="signin" onClick={signinModalHandler}>press start</button>    
            </div>
          : null}

          {/* 가입 전 */}
          {isLoggedIn && !isMember && !isWaiting && partyState <= 0  ? 
            <button onClick={partyJoinModalHandler}>가입 신청</button> 
          : null}

          {/* 대기중 */}
          {isWaiting ? 
            <button onClick={(e) => partyCancelModalHandler(e, "cancel")}>가입 신청 취소</button>
          : null}

          {/* 파티원 */}
          {!isLeader && isMember ? 
            <button onClick={(e) => partyCancelModalHandler(e, "quit")}>파티 탈퇴</button> 
          : null}

          {/* 파티장 */}

          {/* [dev] 대기자 리스트에서 승인했을 때, 바로 partyState가 변경되면 세번째 조건은 필요 없음 */}
          {isLeader && partyState === 0 && memberLimit > members.length ? 
            <button onClick={editHandler}>정보 수정</button> 
          : null}
          {isLeader && partyState === 0 && memberLimit > members.length ? 
            <button onClick={(e) => partyCancelModalHandler(e, "fullParty")}>모집 완료</button> 
          : null}
          {isLeader && partyState === 1 && memberLimit > members.length ? 
            <button onClick={rePartyHandler}>모집 재개</button> 
          : null}
          {isLeader ? 
            <button onClick={(e) => partyCancelModalHandler(e, "dismiss")}>파티 해산</button>
          : null}
          {isLeader && ( partyState === 1 || memberLimit === members.length ) ? 
            <button id="completeBtn" onClick={reviewModalHandler}>퀘스트 완료</button>
          : null}
          {isMember && partyState === 2 && !isReviewed ? 
            <button id="completeBtn" onClick={reviewModalHandler}>퀘스트 완료</button>
          : null}
        </PartyStateBtns>
      </Main>

      {isUserInfoModalOpen? 
        <UserInfoModal 
          userInfoModalHandler={userInfoModalHandler}
          userId={userId}
          leaderId={leaderId}
          isLeader={isLeader}
          isMember={isMember}
          from={from}
          userInfo={userInfo}
        /> 
      :  null}
      {isPartyJoinModalOpen? 
        <PartyJoinModal 
          partyJoinModalHandler={partyJoinModalHandler}
          userId={userId}
          partyId={partyId}
        /> 
      : null}
      {isReviewModalOpen? 
        <ReviewModal 
          reviewModalHandler={reviewModalHandler}
          members={members.filter((member) => member.id !== userId)}
          leaderId={leaderId}
        /> 
      : null}
      {isPartyCancelModalOpen? 
        <PartyCancelModal 
          from={from}
          partyCancelModalHandler={partyCancelModalHandler}
          cancelHandler={cancelHandler}
          quitHandler={quitHandler}
          fullPartyHandler={fullPartyHandler}
          dismissHandler={dismissHandler}
        /> 
      : null}
      {isSigninModalOpen? <SigninModal /> : null}
    </PartyContainer>
  );
}
