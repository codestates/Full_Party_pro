import React from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

export const Container = styled.section`
  width: 100%;
  height: 98vh;

  padding-top: 60px 0;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  header {
    font-weight: bold;
    margin-bottom: 15px;

    .title {
      font-size: 5rem;
      margin-bottom: 10px;
    }

    .details {
      font-size: 1.2rem;
    }
  }

  .notFoundMsg {
    color: #777;
    line-height: 1.5rem;
    margin-bottom: 20px;
  }

  #return {
    width: 300px;
    height: 80px;
    border: none;
    border-radius: 20px;
    background-color: #fff;
    box-shadow: rgba(80, 201, 195, 0.4) 0px 8px 24px;

    font-family: "silkScreenBold";
    font-size: 1.1rem;
    color: #50C9C3;

    margin-top: 25px;
    margin-bottom: 0;
  }
`;

export default function NotFound () {

  const navigate = useNavigate();
   
  return (
    <Container>
      <header>
        <div className="title">404</div>
        <div className="details">요청하신 페이지를 찾을 수 없습니다.</div>
      </header>
      <main>
        <div className="notFoundMsg">
          방문하시려는 페이지의 주소가 잘못되었거나,
          <br />페이지가 삭제되었을 수 있습니다.
          <br />주소를 다시 한 번 확인해주세요.
        </div>
        <button id="return" onClick={() => navigate('../')}>return to home</button>    
      </main>
    </Container>
  );
}
