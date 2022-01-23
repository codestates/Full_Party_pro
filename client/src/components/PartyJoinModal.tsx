import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'

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
  width: 350px;
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
    font-weight: bold;
    font-size: 20pt;
    margin-bottom: 20px;
  }

  .desc {
    margin-bottom: 15px;
  }

  textarea {
    width: 95%;
    height: 200px;
    padding: 15px;
    border: 1px solid #d5d5d5;
    margin-bottom: 20px;
    font-family: "-apple-system";

    &:focus {
      outline-style:none;
    }
  }

  #join {
    width: 95%;
    height: 50px;
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    color: white;
    background-color: #50C9C3; 
  }
`;

export const CloseBtn = styled.button`
  width: 100%;
  text-align: right;
  cursor: pointer;
  margin-bottom: 20px;
  background-color: white;
  border: none;
`;

type Props = {
  partyJoinModalHandler: Function,
  userId: number,
  partyId: number
};

export default function PartyJoinModal({ partyJoinModalHandler, userId, partyId }: Props) {
  const navigate = useNavigate();
  const [ message, setMessage ] = useState("");

  const closeModal = () => {
    partyJoinModalHandler();
  };

  const inputHandler = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(event.target.value);
  };

  const joinHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/party/enqueued`, {
      userId,
      partyId,
      message
    });
    closeModal();
    navigate(`../party/${partyId}`);
  };

  return (
    <ModalContainer>
      <ModalBackdrop onClick={closeModal}>
        <ModalView onClick={(e) => e.stopPropagation()}>
          <CloseBtn onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></CloseBtn>
          <header>Join the Party</header>
          <div className="desc">가입 신청 메시지를 남겨주세요.</div>
          <textarea
            name="message"
            value={message}
            onChange={(e) => inputHandler(e)}
            placeholder="나에 대해 파티원들에게 소개해주세요.&#13;&#10;이 메시지는 가입 신청 승인 후 파티원 모두가 열람할 수 있는 정보이므로, 민감한 정보나 개인 정보는 포함되지 않도록 주의해주세요.">
          </textarea>
          <button id="join" onClick={joinHandler}>
            가입 신청
          </button>
        </ModalView>
      </ModalBackdrop>
    </ModalContainer>
  );
}