import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

export const MemberListContainer = styled.div`
  .emptyMsg {
    margin-top: 10px;
    color: #777;
  }

  .memberList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;

    .memberContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px;
      overflow-wrap: normal;
      cursor: pointer;
    }

    .profileImage {
      width: 50px;
      height: 50px;
      border: 1px solid #d5d5d5;
      border-radius: 100%;
      margin-bottom: 10px;
    }

    .nameplate {
      width: 50px;
      font-size: 0.8rem;
      text-align: center;
      word-break: break-all;
    }

    #leader {
      color: #50C9C3;
    }

    @media screen and (min-width: 600px) {
      .profileImage {
        width: 80px;
        height: 80px;
      }

      .nameplate {
        width: 100px;
        font-size: 1rem;
      }
    }
  }
`;

type Props = {
  from: string,
  leaderId: number,
  members: Array<{ [key: string]: any }>,
  userInfoModalHandler: Function
};

export default function MemberList({ from, leaderId, members, userInfoModalHandler }: Props) {
  if (members.length <= 0) {
    return (
      <MemberListContainer>
        <div className="emptyMsg">아직 이 퀘스트에 지원을 신청한 사람이 없어요.</div>
      </MemberListContainer>
    );
  }

  return (
    <MemberListContainer>
      <div className="memberList">
        {members.map((member, idx) => {
          return (
            <div key={idx} onClick={(e) => userInfoModalHandler(e, from, idx)} className="memberContainer">
              <div 
                className="profileImage" 
                style={{ backgroundImage: `url(${member.profileImage})`, backgroundSize: "cover" }}
              />
              <div className="nameplate">
                {member.id === leaderId ? <FontAwesomeIcon icon={ faFlag } id="leader" /> : null} {member.userName}
              </div>
            </div>
          );
        })}
      </div>
    </MemberListContainer>
  );
}