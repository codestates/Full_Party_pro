import React from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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
`

export const ModalView = styled.div`
/* 
  width: 350px; */

  border-radius: 30px;
  background-color: #fff;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

  padding: 30px;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .title {
    margin-bottom: 20px;
  }

  .buttons {

    button {
      width: 100px;
      height: 50px;
      padding: 10px 20px;
      
      margin: 0 5px;

      border-radius: 20px;
    }

    .delete {
      border: none;
      background-color: #50C9C3;
      color: white; 
    }

    .cancel {
      border: 1px solid #50C9C3; 
      background-color: #fff;
      color: #50C9C3; 
    }
  }
`

export const CloseBtn = styled.button`

  width: 100%;
  text-align: right;

  cursor: pointer;
  margin-bottom: 20px;

  background-color: white;
  border: none;

`

type Props = {
  from: string,
  partyCancelModalHandler: Function,
  cancelHandler: Function,
  quitHandler: Function,
  fullPartyHandler: Function,
  dismissHandler: Function,
  partyInfoId: number
}

const PartyCancelModal = ({ from, partyCancelModalHandler, cancelHandler, quitHandler, fullPartyHandler, dismissHandler, partyInfoId }: Props) => {

  const closeModal =() => {
    partyCancelModalHandler();
  }

  function functionController(){
    if(from === "cancel"){
      cancelHandler();
      window.location.assign(`${process.env.REACT_APP_CLIENT_URL}/party/${partyInfoId}`)
    } else if(from === "quit"){
      quitHandler();
    } else if(from === "fullParty"){
      fullPartyHandler();
      window.location.assign(`${process.env.REACT_APP_CLIENT_URL}/party/${partyInfoId}`)
    } else {
      dismissHandler();
      window.location.assign(`${process.env.REACT_APP_CLIENT_URL}/home`)
    }

    partyCancelModalHandler();
  }

  return(
    <ModalContainer>
      <ModalBackdrop onClick={closeModal}>
        <ModalView onClick={(e) => e.stopPropagation()}>
          <CloseBtn onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></CloseBtn>
          <div className="title">
            {from === "cancel" ? "가입 신청을 취소하시겠습니까?" : null}
            {from === "quit" ? "이 파티에서 탈퇴하시겠습니까?" : null}
            {from === "fullParty" ? "파티원 모집을 중단하시겠습니까?" : null}
            {from === "dismiss" ? "파티를 해산하시겠습니까?" : null}
          </div>
          <div className="buttons">
            <button 
              className="delete" 
              onClick={functionController}
            >
                확인
            </button>
            <button className="cancel" onClick={closeModal}>
                취소
            </button>    
          </div>
        </ModalView>
      </ModalBackdrop>
    </ModalContainer>
  )
}

export default PartyCancelModal;