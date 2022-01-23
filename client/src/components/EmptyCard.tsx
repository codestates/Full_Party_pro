import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export const CardContainer = styled.section`
  width: 100%;
  margin-top: 40px;

  header.listHeader {
    font-size: 1.7rem;
    font-weight: bold;
    margin: 10px 0;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 1.1rem;
    line-height: 2rem;
    margin: 50px 0;
    padding: 20px;

    #post {
      width: 250px;
      height: 60px;
      border: none;
      border-radius: 20px;
      background-color: #fff;
      box-shadow: rgba(80, 201, 195, 0.4) 0px 8px 24px;
      font-family: "silkScreenBold";
      font-size: 1.1rem;
      color: #50C9C3;
      margin-top: 25px;
      margin-bottom: 0;
      cursor: pointer;
    }
  }

  @media screen and (max-width: 540px) {

    main {
      margin: 35px 0;
    }

    .postMsg {
      width: 190px;
      word-break: keep-all;
    }
  }
`;

type Props = {
  from: string
};

export default function EmptyCard({ from } : Props) {
  const navigate = useNavigate();

  return (
    <CardContainer>
      {from === "list" ?
        <header className="listHeader">
          내 주변의 퀘스트
        </header>
      : null}
      <main className="postMsgContainer">
        {from === "list" ?
          <div className="postMsg">
            아직 이 지역에 모집중인 퀘스트가 없어요.
            <br />직접 파티를 만들고 <b>파티원</b>을 찾아보세요! 🧚
          </div>
        : <div className="postMsg" style={{ margin: "50px 0 15px 0" }}>
            찾으시는 퀘스트가 없어요.
            <br />직접 파티를 만들어 <b>파티원</b>을 찾아보세요! 🧚
          </div>}
        <button id="post" onClick={() => navigate('../post')}>press start</button>
      </main>
    </CardContainer>
  );
}