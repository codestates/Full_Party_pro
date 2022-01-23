import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import confetti from 'canvas-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFlag, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faSadCry, faSadTear, faSmile, faGrinWink, faLaughBeam } from '@fortawesome/free-solid-svg-icons';
import { faSadCry as blankSadCry, faSadTear as blankSadTear, faSmile as blankSmile,
  faGrinWink as blankGrinWink, faLaughBeam as blankLaughBeam
} from '@fortawesome/free-regular-svg-icons';

export const ModalContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
`;

export const ModalBackdrop = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalView = styled.div`
  width: 360px;
  border-radius: 30px;
  background-color: #fff;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  header {
    font-family: 'SilkscreenBold';
    font-size: 20pt;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .description {
    font-size: 0.8rem;
    display: none;
    margin: 5px 0;
  }
`;

export const UserInfo = styled.section`
  width: 100%;
  display: flex;
  justify-content: space-between;

  button {
    width: 30px;
    background-color: white;
    border: none;

    &:disabled {
      color: white;
    }
  }

  .memberContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    overflow-wrap: normal;
  }

  .profileImage {
    width: 100px;
    height: 100px;
    border: 1px solid #d5d5d5;
    border-radius: 100%;
    margin-bottom: 10px;
  }

  .nameplate {
    font-size: 1.2rem;
    font-weight: bold;
    word-break: break-all;
    min-width: 100px;
    border-bottom: 1px solid #d5d5d5;
    padding-bottom: 5px;

    #leader {
      color: #50C9C3;
    }
  }
`;

export const ReviewContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin: 10px 0;

  .review {
    width: 100%;
    display: flex;
    justify-content: space-between;

    button {
      background-color: white;
      border: none;
      font-size: 2rem;
    }

    .label {
      margin-top: 2px;
      height: 16px;
      font-size: 0.8rem;
    }
  }
`;

export const CloseBtn = styled.button`
  width: 100%;
  text-align: right;
  cursor: pointer;
  margin-bottom: 10px;
  background-color: white;
  border: none;
`;

export const ProgressBar = styled.section`
  width: 100%;
  margin: 10px 0;
  padding: 0 10px;

  .barContainer {
    height: 10px;
    width: 100%;
    border: 1px solid #e9e7e7;
    border-radius: 50px;
  }

  .barFiller {
    height: 100%;
    background-color: #50C9C3;
    border-radius: inherit;
    text-align: right;
  }
`;

export const CompleteBtns = styled.section`
  display: flex;
  justify-content: center;

  button {
    min-width: 100px;
    height: 50px;
    border: none;
    border-radius: 20px;
    background-color: #50C9C3; 
    color: white;
    margin: 8px;
    padding: 10px 20px;

    &:disabled {
      background-color: white;
      border: 1px solid #d5d5d5;
      color: #d5d5d5;
    }
  }
`;

type Props = {
  reviewModalHandler: Function,
  members: Array<{ [key: string]: any }>,
  leaderId: number,
  isLeader: boolean,
  userId: number,
  partyId: number,
  handlePartyInfoChange: Function
};

interface keyable {
 [key: string]: any
};

export default function ReviewModal({ reviewModalHandler, members, leaderId, isLeader, userId, partyId, handlePartyInfoChange }: Props) {
  const [curIdx, setCurIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reviewMembers, setReviewMembers] = useState<Array<keyable>>(members.map((member) => ({ ...member, exp: null })));
  const curMember = reviewMembers[curIdx];
  const { userName, profileImage, exp } = curMember;

  const memberToReview = reviewMembers.filter((member) => member.exp === null).length;

  const closeModal =() => {
    reviewModalHandler();
  };

  const reviewHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const reviewedExp = (event.currentTarget as HTMLButtonElement).value;
    setReviewMembers(reviewMembers.map((member, idx) => (idx === curIdx ? { ...member, exp: Number(reviewedExp) } : member)));
    setProgress(memberToReview > 0 ? ((members.length - memberToReview + 1)/members.length*100) : 100);
  };

  const handleMemberChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const toGo = (event.currentTarget as HTMLButtonElement).value;
    if (toGo === "left") setCurIdx(curIdx - 1);
    else setCurIdx(curIdx + 1);
  };

  const questCompleteHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const reviewedMembers = reviewMembers.map((member) => ({ userId: member.id, exp: member.exp}));
    if (isLeader) {
      await axios.patch(`${process.env.REACT_APP_API_URL}/party/completed`, {
        partyId
      }, { withCredentials: true });
      handlePartyInfoChange("partyState", 2);
    }
    await axios.patch(`${process.env.REACT_APP_API_URL}/party/review`, {
      partyId,
      userId,
      exp: reviewedMembers,
    }, { withCredentials: true });
    handlePartyInfoChange("isReviewed", true);
    confetti();
    reviewModalHandler();
  };

  return (
    <ModalContainer>
      <ModalBackdrop>
        <ModalView>
          <CloseBtn onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></CloseBtn>
          <header>Quest<br />Complete!</header>
          <section className="description">
            모두와 함께하는 퀘스트는 어떠셨나요?<br />
            파티원들의 평가가 끝난 후 퀘스트가 완료됩니다.
          </section>

          <ProgressBar>
            <div className="barContainer">
              <div className="barFiller" style={{ width: `${progress}%` }} />
            </div>
          </ProgressBar>

          <UserInfo>
            <button
              value="left"
              onClick={handleMemberChange}
              disabled={curIdx === 0}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="memberContainer">
              <div
                className="profileImage"
                style={{ backgroundImage: `url(${profileImage})`, backgroundSize: "cover" }}
              />
              <div className="nameplate">
              {curMember.id === leaderId? <FontAwesomeIcon icon={ faFlag } id="leader" /> : null} {userName}
              </div>
            </div>
            <button
              value="right"
              onClick={handleMemberChange}
              disabled={curIdx === (members.length-1)}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </UserInfo>

          <ReviewContainer>
            <div className="review buttons">
              <button value="-2" onClick={(e) => reviewHandler(e)}>
                <FontAwesomeIcon 
                  icon={exp === -2 ? faSadCry : blankSadCry} 
                  style={{color: exp === -2 ? "#50C9C3" : "#d5d5d5"}}
                />
                <div className="label">별로에요</div>
              </button>
              <button value="-1" onClick={(e) => reviewHandler(e)}>
                <FontAwesomeIcon 
                  icon={exp === -1 ? faSadTear : blankSadTear} 
                  style={{color: exp === -1 ? "#50C9C3" : "#d5d5d5"}}
                />
                <div className="label"> </div>
              </button>
              <button value="0" onClick={(e) => reviewHandler(e)}>
                <FontAwesomeIcon 
                  icon={exp === 0 ? faSmile : blankSmile}
                  style={{color: exp === 0 ? "#50C9C3" : "#d5d5d5"}} 
                />
                <div className="label">괜찮아요</div>
              </button>
              <button value="1" onClick={(e) => reviewHandler(e)}>
                <FontAwesomeIcon 
                  icon={exp === 1 ? faGrinWink : blankGrinWink} 
                  style={{color: exp === 1 ? "#50C9C3" : "#d5d5d5"}}
                />
                <div className="label"> </div>
              </button>
              <button value="2" onClick={(e) => reviewHandler(e)}>
                <FontAwesomeIcon 
                  icon={exp === 2 ? faLaughBeam : blankLaughBeam} 
                  style={{color: exp === 2 ? "#50C9C3" : "#d5d5d5"}}
                />
                <div className="label">최고에요</div>
              </button>
            </div>
          </ReviewContainer>

          <CompleteBtns>
            <button 
              onClick={questCompleteHandler}
              disabled={memberToReview > 0}
            >
              퀘스트 완료
            </button>
          </CompleteBtns>

        </ModalView>
      </ModalBackdrop>
    </ModalContainer>
  );
}