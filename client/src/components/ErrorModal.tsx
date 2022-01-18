import React from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export const ModalContainer = styled.div`
  width: 100vw;
  height: 100vh;

  position: fixed;
  left: 0;
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
    line-height: 1.7rem;
  }

 
  button.exit {
    width: 100px;
    height: 50px;
    padding: 10px 20px;
    
    margin: 0 5px;

    border-radius: 20px;
    
    cursor: pointer;

    border: none;
    background-color: #50C9C3;
    color: white; 
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
  errorModalHandler: Function,
}

const ErrorModal = ({ errorModalHandler }: Props) => {

  const closeModal =() => {
    errorModalHandler();
  }


  return(
    <ModalContainer>
      <ModalBackdrop onClick={closeModal}>
        <ModalView onClick={(e) => e.stopPropagation()}>
          <CloseBtn onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></CloseBtn>
          <div className="title">
            네트워크 오류로 퀘스트 등록에 실패했습니다.
            <br />다시 시도해주세요.
          </div>
          <button 
            className="exit" 
            onClick={closeModal}
          >
            확인
          </button>
        </ModalView>
      </ModalBackdrop>
    </ModalContainer>
  )
}

export default ErrorModal;