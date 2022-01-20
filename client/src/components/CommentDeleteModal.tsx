import React from 'react';
import axios from "axios";
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
  commentDeleteModalHandler: Function,
  commentToDelete: { [key: string] : number },
}

const CommentDeleteModal = ({ commentDeleteModalHandler, commentToDelete }: Props) => {

  const { idx, commentId } = commentToDelete;

  const closeModal =() => {
    commentDeleteModalHandler();
  }

  async function deleteHandler(event: React.MouseEvent<HTMLButtonElement>) {
    // [dev] 덧글의 경우 코멘트 아이디, 대댓글의 경우 서브코멘트아이디 패러미터로 전달
    if (idx === 0){
      await axios.delete(`${process.env.REACT_APP_API_URL}/party/comment/${commentId}`);
      console.log("덧글을 삭제합니다.");
    } 
    else {
      await axios.delete(`${process.env.REACT_APP_API_URL}/party/subComment/${commentId}`);
      console.log("대댓글을 삭제합니다.")
    }

    commentDeleteModalHandler();
  }

  return(
    <ModalContainer>
      <ModalBackdrop onClick={closeModal}>
        <ModalView onClick={(e) => e.stopPropagation()}>
          <CloseBtn onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></CloseBtn>
          <div className="title">덧글을 삭제하시겠습니까?</div>
          <div className="buttons">
            <button className="delete" onClick={deleteHandler}>
                삭제
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

export default CommentDeleteModal;