import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { AppState } from '../reducers';

export const QnAContainer = styled.section`

  .label {
    background-color: #50C9C3;

    .title {
      color: white;
      font-size: 1.3rem;
      font-weight: bold;

      padding: 20px;
    }
  }

`;

type Props = {
  isLeader: boolean,
  comments: Array<{ [key: string]: any }>
};

export default function QnA ({ isLeader, comments }: Props) {

  const isLoggedIn = useSelector(
    (state: AppState) => state.userReducer.isLoggedIn
  );

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  if(comments.length <= 0){
    return (
      <QnAContainer>
        <div className="label">
          <div className="title">문의하기</div>
        </div>
        <div>
         {/* 아무튼 없다는 얘기, 인풋창으로 추가할 수만 있게 처리 */}
        </div>
      </QnAContainer>
    )
  }

  return (
    <QnAContainer>
      <div className="label">
        <div className="title">문의하기</div>
        
      </div>
      <table>

      </table>
    </QnAContainer>
  );
}
