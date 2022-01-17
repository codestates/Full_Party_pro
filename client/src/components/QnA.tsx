import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AppState } from '../reducers';

import CommentDeleteModal from './CommentDeleteModal';

export const QnAContainer = styled.section`

  header {
    width: 100%;
    padding: 20px;
    background-color: #50C9C3;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      color: white;
      font-size: 1.3rem;
      font-weight: bold;
    }

    .edit {
      width: 60px;
      height: 30px;

      background: #fff;
      color: #50C9C3;
      border: none;
      border-radius: 20px;
    }
  }

  .firstComment {
    padding-bottom: 20px;
    border-bottom: 1px solid #d5d5d5;
  }

  .date {
    font-size: 0.8rem;
    color: #777;
  }
`;

export const Comments = styled.section`

  .commentsContainer {
    cursor: default;
    border-bottom: 1px solid #d5d5d5;
  }

  .commentList {
    padding: 15px 20px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    cursor: pointer;
  }
`;

export const CommentDetails = styled.div`

  display: flex;
  flex-direction: column;
  align-items: center;

  .subcommentList {
    display: flex;
    justify-content: center;

    width: 90%;
  }

  .profileContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    overflow-wrap: normal;

    margin: 0 10px;
  }

  .profileImage {
    width: 50px;
    height: 50px;
    border: 1px solid #d5d5d5;
    border-radius: 100%;

    margin-bottom: 5px;
  }

  .nameplate {
    font-size: 0.8rem;
    font-weight: bold;
    word-break: break-all;

    width: 50px;

    #leader {
      color: #50C9C3;
    }
  }

  .subcommentList {
    margin: 8px 0;

    .subCommentContainer {
      border-radius: 20px;

      width: 100%;
      padding: 15px 20px;
      margin-bottom: 10px;

      .subContent {
        margin-bottom: 3px;
      }
    }
  }

  .delete {
    color: #777;

    border: none;
    background-color: white;

    margin: 0 15px;
  }
`;

export const CommentInput = styled.section`

  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-end;

  padding: 10px 20px;

  textarea {
    width: 100%;
    height: 80px;

    border: 1px solid #bebebe;
    padding: 10px;
  }

  #commentInput {
    margin-top: 15px;
  }

  .submit {
    width: 80px;
    height: 30px;

    background-color: #50C9C3;
    color: #fff;
    border: none;
    border-radius: 20px;

    margin-top: 15px;

    &:disabled {
      background-color: #fff;
      color: #50C9C3;
      border: 1px solid #50C9C3;
    }
  }
`;

type Props = {
  partyId: number,
  isLeader: boolean,
  leaderId: number,
  comments: Array<{ [key: string]: any }>,
  findComment: number,
};

export default function QnA ({ partyId, isLeader, leaderId, comments, findComment }: Props) {

  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLoggedIn
  );

  // [dev] 메시지 등록 권한을 위해 임시로 설정한 유저 아이디, 나중에 리덕스에서 userId 불러오는 코드로 바꾸기
  const userId = 1;

  const [commentIdx, setCommentIdx] = useState(-1);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const curComments = comments.map((comment) => [ comment.comment, ...comment.subcomments ])[commentIdx];

  const [isEditMode, setIsEditMode] = useState(false);
  const [newComment, setNewComment] = useState({comment: "", subcomment: ""});

  const [isCommentDeleteModalOpen, setIsCommentDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState({});

  function editHandler(event: React.MouseEvent<HTMLButtonElement>): void {
    setNewComment({ ...newComment, comment : "" });
    setIsEditMode(!isEditMode);
  }

  function commentListHandler(event: React.MouseEvent<HTMLDivElement>, idx: number): void {

    setNewComment({ ...newComment, subcomment : "" });
    setCommentIdx(idx);

    if(!isCommentOpen){
      setIsCommentOpen(true);
    } else if(idx === commentIdx) {
      setIsCommentOpen(false);
    }
  }

  function inputHandler(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    setNewComment({ ...newComment, [event.target.name] : event.target.value });
  }

  function postHandler(event: React.MouseEvent<HTMLButtonElement>) {
    // [dev] userId, partyId, content 서버로 전송
    console.log({userId: userId, partyId: partyId, content: newComment.comment});
    console.log("코멘트를 등록합니다.");
  }

  function replyHandler(event: React.MouseEvent<HTMLButtonElement>, commentId:number) {
    // [dev] userId, commentId, content 서버로 전송
    console.log({userId: userId, commentId: commentId, content: newComment.subcomment});
    console.log("서브코멘트를 등록합니다.");
  }

  function commentDeleteModalHandler(event: React.MouseEvent<HTMLButtonElement>, idx: number, commentId:number): void {
    setCommentToDelete({ idx: idx, commentId: commentId })
    setIsCommentDeleteModalOpen(!isCommentDeleteModalOpen);
  }

  useEffect(() => {
    if(findComment >= 0){
      const idx = comments.findIndex((comment) => comment.comment.id === findComment);
      setCommentIdx(idx);
      setIsCommentOpen(true);
    }
  }, [findComment])

  if(comments.length <= 0){
    return (
      <QnAContainer>
        <header>
          <div className="title">문의하기</div>
          {isLoggedIn ? <button className="edit" onClick={editHandler}>글쓰기</button> : null}
        </header>
        {isEditMode? 
        <CommentInput className="firstComment">
          <textarea
            id="commentInput"
            name="comment"
            value={newComment.comment}
            onChange={(e) => inputHandler(e)}
          />
          <button onClick={postHandler} disabled={!newComment.comment}>등록하기</button>  
        </CommentInput>
      : null}
      </QnAContainer>
    )
  }

  return (
    <QnAContainer>
      <header>
        <div className="title">문의하기</div>
        {isLoggedIn ? <button className="edit" onClick={editHandler}>글쓰기</button> : null}
      </header>

      {isEditMode? 
        <CommentInput>
          <textarea
            id="commentInput"
            name="comment"
            value={newComment.comment}
            onChange={(e) => inputHandler(e)}
          />
          <button 
            className="submit" 
            onClick={postHandler}
            disabled={!newComment.comment}
          >
            등록하기
          </button>  
        </CommentInput>
      : null}

      <Comments style={{ borderTop: isEditMode? "1px solid #d5d5d5" : "none" }}>
        {comments.map((comment, idx) => 
          <div className="commentsContainer" key={idx}>
            <div className="commentList" onClick={(e) => commentListHandler(e, idx)}>
              <div className="content">{comment.comment.content}</div>
              <div className="date">{comment.comment.createdAt}</div>
            </div>
            {isCommentOpen && idx === commentIdx ? 
              <CommentDetails>
                {curComments.map((subcomment: { [key:string] : any }, idx) => {
                    if(subcomment.userId === leaderId){
                      return (
                        <div key={idx} className="subcommentList">
                          {isLeader ?
                            <button
                              className="delete"
                              onClick={(e) => commentDeleteModalHandler(e, idx, subcomment.id)}
                            >
                              <FontAwesomeIcon icon={ faTrashAlt } />
                            </button>
                          : null}
                          <div className="subCommentContainer" style={{ backgroundColor: "#50C9C3", color: "#fff" }}>
                            <div className="subContent">{subcomment.content}</div>
                            <div className="date">{subcomment.createdAt}</div> 
                          </div>
                          <div className="profileContainer">
                            <div className="profileImage" style={{ backgroundImage: `url(${subcomment.profileImage})`, backgroundSize: "cover" }} />
                            <div className="nameplate"><FontAwesomeIcon icon={ faFlag } id="leader" /> {subcomment.userName}</div>
                          </div>
                        </div>
                      )
                    } else {
                      return (
                        <div key={idx} className="subcommentList">
                          <div className="profileContainer">
                            <div className="profileImage" style={{ backgroundImage: `url(${subcomment.profileImage})`, backgroundSize: "cover" }} />
                            <div className="nameplate">{subcomment.userName}</div>
                          </div>
                          <div className="subCommentContainer" style={{ border: "1px solid #d5d5d5" }}>
                            <div className="subContent">{subcomment.content}</div>
                            <div className="date">{subcomment.createdAt}</div> 
                          </div>
                          {subcomment.userId === userId ?
                            <button
                              className="delete"
                              onClick={(e) => commentDeleteModalHandler(e, idx, subcomment.id)}
                            >
                              <FontAwesomeIcon icon={ faTrashAlt } />
                            </button>
                          : null}
                        </div>
                      )
                    }
                  } 
                )}
                {isLeader || userId === comment.comment.userId ?
                  <CommentInput>
                    <textarea
                      name="subcomment"
                      value={newComment.subcomment}
                      onChange={(e) => inputHandler(e)}
                    />
                    <button
                      className="submit" 
                      onClick={(e) => replyHandler(e, comment.comment.id)}
                      disabled={!newComment.subcomment}
                    >
                      등록하기
                    </button>
                  </CommentInput>
                : null}
              </CommentDetails>  
            : null}
          </div>
        )}
      </Comments>

      {isCommentDeleteModalOpen? 
        <CommentDeleteModal 
          commentDeleteModalHandler={commentDeleteModalHandler}
          commentToDelete={commentToDelete}
        /> 
      : null}
    </QnAContainer>
  );
}
