import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlusCircle, faBookmark, faUser } from '@fortawesome/free-solid-svg-icons';

export const NavContainer = styled.nav`
  width: 100vw;
  height: 60px;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 900;
  background-color: white;
  box-shadow: rgba(149, 157, 165, 0.2) 0px -8px 24px;
  display: flex;
  justify-content: space-around;

  .button {
    width: 25vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    color: #777;
    font-size: 10pt;
    cursor: pointer;

    .icon {
      font-size: 16pt;
      margin-bottom: 3px;
    }

    &:hover {
      border-top: 3px solid #50C9C3;
    }
  }
`;

export default function BottomNav () {

  return (
    <NavContainer>
      <Link to="/home" style={{ textDecoration: 'none' }}>
        <div className="button">
          <FontAwesomeIcon icon={ faHome } className="icon" /> 홈
        </div>  
      </Link>
      <Link to="/post" style={{ textDecoration: 'none' }}>
        <div className="button">
          <FontAwesomeIcon icon={ faPlusCircle } className="icon" /> 파티 개설
        </div>  
      </Link>
      <Link to="/favorite" style={{ textDecoration: 'none' }}>
        <div className="button">
          <FontAwesomeIcon icon={ faBookmark } className="icon" /> 관심 파티
        </div>  
      </Link>
      <Link to="/mypage" style={{ textDecoration: 'none' }}>
        <div className="button">
          <FontAwesomeIcon icon={ faUser } className="icon" /> 마이페이지
        </div>  
      </Link>
    </NavContainer>
  );
}