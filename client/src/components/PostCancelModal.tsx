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

  .buttons {

    button {
      width: 100px;
      height: 50px;
      padding: 10px 20px;
      
      margin: 0 5px;

      border-radius: 20px;
      
      cursor: pointer;
    }

    .exit {
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
  postCancelHandler: Function
  backToPage: Function
}

const PostCancelModal = ({ postCancelHandler, backToPage }: Props) => {

  const closeModal =() => {
    postCancelHandler();
  }

  return(
    <ModalContainer>
      <ModalBackdrop onClick={closeModal}>
        <ModalView onClick={(e) => e.stopPropagation()}>
          <CloseBtn onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></CloseBtn>
          <div className="title">
            페이지를 이동하시면
            <br />지금까지 작업하신 내용은 전부 사라집니다.
          </div>
          <div className="buttons">
            <button 
              className="exit" 
              onClick={() => backToPage()}
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

export default PostCancelModal;