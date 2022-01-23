import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { cookieParser } from "../App";
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
import PartyEdit from '../components/PartyEdit';
import { NOTIFY } from '../actions/notify';
import PartyMap from '../components/PartyMap';
import MemberList from '../components/MemberList';
import QnA from '../components/QnA';
import NotFound from '../pages/NotFound';

import { AppState } from '../reducers';

import axios from 'axios';

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
      font-family: "-apple-system";
      
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

      cursor: pointer;
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

      &.waitingList {
        cursor: pointer;
      }
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const commentRef = useRef<HTMLElement>(null);

  const userId = useSelector(
    (state: AppState) => state.signinReducer.userInfo.id
  );

  const isLoggedIn = cookieParser().isLoggedIn;

  const { Kakao } = window;

  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [ userState, setUserState ] = useState({
    isLeader: false,
    isMember: false,
    isWaiting: false
  });
  const { isLeader, isMember, isWaiting } = userState;

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
  const [isEdit, setIsEdit] = useState(false);

  const [from, setFrom] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [findComment, setFindComment] = useState(-1);

  const [ partyInfo, setPartyInfo ] = useState({
    name: "",
    startDate: "",
    endDate: "",
    content: "",
    favorite: 0,
    id: 0,
    image: "",
    isOnline: 0,
    leaderId: 0,
    privateLink: "",
    partyState: 0,
    region: "",
    location: "",
    latlng: "",
    memberLimit: 2,
    isReviewed: false,
    isFavorite: false,
    members: [{
      exp: 0,
      id: 0,
      joinDate: "",
      message: "",
      profileImage: "",
      userName: ""
    }],
    tag: [],
    waitingQueue: [{
      id: 0,
      userName: "",
      profileImage: "",
      level: 0,
      message: ""
    }]
  });

  const [ comments, setComments ] = useState([]);
  
  const formatDate = (date: String) => date.slice(0, 11);

  function handlePartyInfoChange(key: string, value: any){
    setPartyInfo({
      ...partyInfo,
      [key]: value,
    })
  }

  function handleMemberListChange(userInfo: any, action: string){
    if(action === "accept"){
      setPartyInfo({
        ...partyInfo,
        members: [ ...partyInfo.members, { ...userInfo, joinDate: new Date().toISOString(), isReviewd: false } ]
      })
    } else if(action === "refuse"){
      setPartyInfo({
        ...partyInfo,
        waitingQueue: partyInfo.waitingQueue.filter((waiter) => waiter.id !== userInfo)
      })
    } else if(action === "expel"){
      setPartyInfo({
        ...partyInfo,
        members: partyInfo.members.filter((member) => member.id !== userInfo)
      })
    }
  }

  function handleMemberInfoChange(userId: number, key: string, value: any){
    const newMemberInfo = partyInfo.members.map((member) => (member.id === userId ? { ...member, [key]: value } : member));
    setPartyInfo({
      ...partyInfo,
      members: newMemberInfo,
    })
  }

  async function favoriteHandler(event: React.MouseEvent<HTMLButtonElement>) {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/favorite/${partyInfo.id}`, { 
      userId, partyId: partyInfo.id
     }, {
      withCredentials: true
    });
    if(partyInfo.isFavorite){
      setPartyInfo({
        ...partyInfo,
        favorite: partyInfo.favorite - 1,
        isFavorite: false,
      })
    } else {
      setPartyInfo({
        ...partyInfo,
        favorite: partyInfo.favorite + 1,
        isFavorite: true,
      }) 
    }
    
  }

  function shareHandler(event: React.MouseEvent<HTMLButtonElement>) {

    const leader = partyInfo.members.filter((member) => member.id === partyInfo.leaderId)[0];
    const hashtags = partyInfo.tag.map((t) => `#${t}`).join(" ");

    Kakao.Link.sendDefault({
      objectType: 'feed',
      itemContent: {
        profileText: `${leader.userName}님의 지원 요청!`,
        profileImageUrl: leader.profileImage, 
      },
      content: {
        title: `[퀘스트] ${partyInfo.name}`,
        description: `${partyInfo.content}\n ${hashtags}`,
        imageUrl: partyInfo.image,
        link: {
          mobileWebUrl: `https://fullpartypro.com/party/${params.partyId}`,
          webUrl: `https://fullpartypro.com/party/${params.partyId}`,
        },
      },
      social: { 
        likeCount: partyInfo.favorite,
        subscriberCount: partyInfo.members.length 
      },
      buttonTitle: '퀘스트 참여하기'
    })
  }

  const tagSearchHandler = (tag: string) => {
    navigate(`../search/tag/${tag}`);
  }

  const waitingListHandler = (event: React.MouseEvent<HTMLDivElement>): void =>{
    setIsWaitingListOpen(!isWaitingListOpen);
  }

  const userInfoModalHandler = (event: React.MouseEvent<HTMLDivElement>, from: string, listIdx: number): void => {
   
    setFrom(from);
    if (from === "members") {
      setUserInfo(partyInfo.members[listIdx]);
    } 
    else {
      setUserInfo(partyInfo.waitingQueue[listIdx]);
    }
    setIsUserInfoModalOpen(!isUserInfoModalOpen);
  }

  const partyJoinModalHandler = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setIsPartyJoinModalOpen(!isPartyJoinModalOpen);
  }

  const signinModalHandler = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setIsSigninModalOpen(!isSigninModalOpen);
  }

  const reviewModalHandler = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setIsReviewModalOpen(!isReviewModalOpen);
  }

  const partyCancelModalHandler = (event: React.MouseEvent<HTMLButtonElement>, from: string): void => {
    setFrom(from);
    setIsPartyCancelModalOpen(!isPartyCancelModalOpen);
  }
  
  const editHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsEdit(!isEdit);
  }

  const cancelHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/party/dequeued/${partyInfo.id}/cancel/${userId}`);
    const waiterLeft = partyInfo.waitingQueue.filter((waiter) => waiter.id !== userId);
    setPartyInfo({
      ...partyInfo,
      waitingQueue: waiterLeft,
    });
    setUserState({
      ...userState,
      isWaiting: false,
    });
  }

  const quitHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/party/quit/${partyInfo.id}/quit/${userId}`);
    const memberLeft = partyInfo.members.filter((member) => member.id !== userId);
    setPartyInfo({
      ...partyInfo,
      members: memberLeft,
    })
    setUserState({
      ...userState,
      isMember: false,
    });
  }

  const fullPartyHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const res = await axios.patch(`${process.env.REACT_APP_API_URL}/party/fullParty`, {
      partyId: partyInfo.id
    });
    if(res.status === 200) {
      setPartyInfo({
        ...partyInfo,
        partyState: 1
      })
    }
  }

  const rePartyHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const res = await axios.patch(`${process.env.REACT_APP_API_URL}/party/reParty`, {
      partyId: partyInfo.id
    });
    if(res.status === 200) {
      setPartyInfo({
        ...partyInfo,
        partyState: 0
      })
    }
  }

  const dismissHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/party/${partyInfo.id}`);
    navigate('../home');
  }

  useEffect(() => {
    setIsUserInfoModalOpen(false);
    setIsLoading(true);
    if(params.commentId){
      setFindComment(Number(params.commentId));
    }
    axios.get(`${process.env.REACT_APP_API_URL}/party/${params.partyId}/${userId}`)
    .then(res => {
      setPartyInfo(res.data.partyInfo);
      setComments(res.data.comments);
      dispatch({
        type: NOTIFY,
        payload: {
          isBadgeOn: res.data.notification
        }
      });
    })
    .catch(err => {
      if(err.response.status === 404){
        setNotFound(true);
        setIsLoading(false);
      }
    });
    setIsLoading(false);
  }, [params]);
  
  useEffect(() => {
    setIsLoading(true);
    if (userId === partyInfo.leaderId) {
      setUserState({
        isLeader: true,
        isMember: true,
        isWaiting: false
      });
    }
    else if (partyInfo.members.filter((item: any) => item.id === userId).length) {
      setUserState({
        isLeader: false,
        isMember: true,
        isWaiting: false
      });
    }
    else if (partyInfo.waitingQueue.filter((item: any) => item.id === userId).length) {
      setUserState({
        isLeader: false,
        isMember: false,
        isWaiting: true
      });
    };
    setIsLoading(false);
  }, [ partyInfo ]);
  
  useEffect(() => {
    setIsLoading(false);
  }, [ userState ]);

  if(isLoggedIn === "0"){
    return <Navigate to="../" />
  } else if(isLoading) {
    return <Loading />
  } else if(notFound) {
    return <NotFound />
  }

  return (
    <PartyContainer style={isLoggedIn === "1" ? {} : { marginBottom: "50px" }}>

      {/* 뒤로가기, 관심파티, 공유 버튼 */}
      <CVBtns>
        <div className="flexBox">
          <button onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={ faArrowLeft } className="icon" /> 
          </button>
          <div className="rightWrapper">
            {isLoggedIn === "1" ?
              <button onClick={favoriteHandler}>
                <FontAwesomeIcon 
                  icon={partyInfo.isFavorite ? faHeart : blankFaHeart} 
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
          <img src={partyInfo.image} className="thumbnail" alt="thumbnail" />
          <div className="titleContainer">
            <div id="partyState">
              {partyInfo.partyState === 0 ? 
                <>
                  <FontAwesomeIcon icon={ faBullhorn } /> 모집중 퀘스트
                </>
              : null}
              {partyInfo.partyState === 1 ?
                <>
                  <FontAwesomeIcon icon={ faBirthdayCake } /> 진행중 퀘스트
                </>
              : null}
              {partyInfo.partyState === 2 ? 
                <>
                  <FontAwesomeIcon icon={ faCalendarCheck } /> 완료된 퀘스트
                </>
              : null}
            </div>
            <div className="titleAndChat">
              <div id="title">{ partyInfo.name }</div>
              {isMember? 
                <button className="privateLink">
                  <a href={ partyInfo.privateLink } target="_blank" rel="noreferrer" style={{ color: "#000" }}>
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
            style={isLoggedIn === "1" ? { cursor: "pointer" } : { cursor: "default" }}
            disabled={isLoggedIn === "0"}
          >
            <FontAwesomeIcon 
              icon={partyInfo.isFavorite ? faHeart : blankFaHeart}
              className="favorite" 
            />
            &nbsp;{ partyInfo.favorite }
          </button>
          <div className="tagContainer">
            { partyInfo.tag.map((t, idx) => 
              <button 
                key={idx} 
                className="tag" 
                onClick={() => tagSearchHandler(t)}
                style={isLoggedIn === "1" ? { cursor: "pointer" } : { cursor: "default" }}
                disabled={isLoggedIn === "0"}
              >
                #{t}
              </button>
            )}
          </div>
        </FavAndTag>

        {/* 글 내용 */}
        <section className="contentContainer">
          <pre className="content">
            { partyInfo.content }
          </pre>
        </section>

        {/* 지역과 일정 */}
        <TimeandLocation>
          <div className="topWrapper">
            <div className="details">
              <div className="icon"><FontAwesomeIcon icon={ faMapMarkerAlt } /></div>
              { !isMember || partyInfo.isOnline ? partyInfo.region : partyInfo.location }
            </div>
            <div className="details">
              <div className="icon"><FontAwesomeIcon icon={ faCalendarAlt } /></div>
              { formatDate(partyInfo.startDate) } ~ { formatDate(partyInfo.endDate) }
            </div>
          </div>
          {partyInfo.isOnline ?
            <div className="details">
              <div className="icon"><FontAwesomeIcon icon={ faGlobe } /></div>
              {isMember? 
                <a href={partyInfo.location}>{partyInfo.location}</a>
              : "이 퀘스트는 온라인으로 진행되는 퀘스트입니다." }
            </div>
          : null}
        </TimeandLocation>

        {/* 지도 */}
        {!partyInfo.isOnline? 
          <div className="mapDesc">
            <PartyMap
              isMember={isMember}
              location={partyInfo.location}
              image={partyInfo.image}
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
              leaderId={partyInfo.leaderId}
              members={partyInfo.members}
              userInfoModalHandler={userInfoModalHandler}
            />
          </div>
        </MembersContainer>

        {isLeader && partyInfo.partyState <= 0 && partyInfo.memberLimit > partyInfo.members.length ? 
          <MembersContainer>
            <div className="members">
              <div className="label waitingList" onClick={waitingListHandler}>
                퀘스트 지원자&ensp;<FontAwesomeIcon icon={isWaitingListOpen? faAngleUp : faAngleDown} />
              </div> 
              {isWaitingListOpen ?
                <MemberList
                  from="waitingQueue"
                  leaderId={partyInfo.leaderId}
                  members={partyInfo.waitingQueue}
                  userInfoModalHandler={userInfoModalHandler}
                />
              : null}
            </div>
          </MembersContainer> 
        : null}

        {/* 문의 게시판 */}
        <section id="qna" ref={commentRef}>
          <QnA 
            partyId={partyInfo.id}
            isLeader={isLeader}
            leaderId={partyInfo.leaderId}
            comments={comments.map(comment => comment).reverse()}
            findComment={findComment}
          /> 
        </section>
        
        <PartyStateBtns>
          {/* 비로그인 상태 */}
          {isLoggedIn === "0" ?
            <div className="signinMsgContainer">
              <div className="signinMsg">
                <b>로그인</b>해서 이 파티의 회원이 되어보세요! 🥳
              </div>
              <button id="signin" onClick={signinModalHandler}>press start</button>    
            </div>
          : null}

          {/* 가입 전 */}
          {isLoggedIn === "1" && !isMember && !isWaiting && partyInfo.partyState <= 0  ? 
            <button onClick={partyJoinModalHandler}>가입 신청</button> 
          : null}

          {/* 대기중 */}
          {isWaiting ? 
            <button onClick={(e) => partyCancelModalHandler(e, "cancel")}>가입 신청 취소</button>
          : null}

          {/* 파티원 */}
          {!isLeader && isMember && partyInfo.partyState === 0 ? 
            <button onClick={(e) => partyCancelModalHandler(e, "quit")}>파티 탈퇴</button> 
          : null}

          {/* 파티장 */}

          {/* [dev] 대기자 리스트에서 승인했을 때, 바로 partyState가 변경되면 세번째 조건은 필요 없음 */}
          {isLeader && partyInfo.partyState === 0 && partyInfo.memberLimit > partyInfo.members.length ? 
            <button onClick={editHandler}>정보 수정</button> 
          : null}
          {isLeader && partyInfo.partyState === 0 && partyInfo.members.length > 1 && partyInfo.memberLimit > partyInfo.members.length ? 
            <button onClick={(e) => partyCancelModalHandler(e, "fullParty")}>모집 완료</button> 
          : null}
          {isLeader && partyInfo.partyState === 1 && partyInfo.memberLimit > partyInfo.members.length ? 
            <button onClick={rePartyHandler}>모집 재개</button> 
          : null}
          {isLeader && !partyInfo.isReviewed ? 
            <button onClick={(e) => partyCancelModalHandler(e, "dismiss")}>파티 해산</button>
          : null}
          {isLeader && ( partyInfo.partyState === 1 || partyInfo.memberLimit === partyInfo.members.length ) && !partyInfo.isReviewed? 
            <button id="completeBtn" onClick={reviewModalHandler}>퀘스트 완료</button>
          : null}
          {isMember && partyInfo.partyState === 2 && !partyInfo.isReviewed ? 
            <button id="completeBtn" onClick={reviewModalHandler}>퀘스트 완료</button>
          : null}
        </PartyStateBtns>
      </Main>

      {isUserInfoModalOpen? 
        <UserInfoModal 
          userInfoModalHandler={userInfoModalHandler}
          partyId={partyInfo.id}
          userId={userId}
          leaderId={partyInfo.leaderId}
          isLeader={isLeader}
          isMember={isMember}
          from={from}
          userInfo={userInfo}
          handleMemberListChange={handleMemberListChange}
          handleMemberInfoChange={handleMemberInfoChange}
        /> 
      :  null}
      {isPartyJoinModalOpen? 
        <PartyJoinModal 
          partyJoinModalHandler={partyJoinModalHandler}
          userId={userId}
          partyId={partyInfo.id}
        /> 
      : null}
      {isReviewModalOpen? 
        <ReviewModal 
          reviewModalHandler={reviewModalHandler}
          members={partyInfo.members.filter((member) => member.id !== userId)}
          leaderId={partyInfo.leaderId}
          isLeader={isLeader}
          userId={userId}
          partyId={partyInfo.id}
          handlePartyInfoChange={handlePartyInfoChange}
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
          partyInfoId={partyInfo.id}
        /> 
      : null}
      {isEdit?
        <PartyEdit
          party={partyInfo}
          editHandler={editHandler}
        />
      : null}
      {isSigninModalOpen? <SigninModal /> : null}
    </PartyContainer>
  );
}
