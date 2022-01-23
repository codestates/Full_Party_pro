import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
import { AppState } from '../reducers';

import { modalChanger } from '../actions/modal';

export const NavContainer = styled.nav`
  width: 100vw;
  height: 60px;

  padding: 0 15px;

  position: fixed;
  left: 0;
  top: 0;
  z-index: 900;

  background-color: white;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  #logo {
    background-color: white;
    border: none;

    cursor: pointer;

    img {
      height: 45px;
    }
  }

  .userMenu {
    width: 100px;
    text-align: center;
    
    display: flex;

    color: #777;
    font-size: 12pt;

    .icon {
      font-size: 20pt;
    }

    button {
      width: 150px; 
      /* display: flex;
      justifyContent: 'center', alignItems: 'center',  */
      color: #777;
      background-color: #fff;
      border: none;
    }

    #notification {
      width: 10px;
      height: 10px;

      position: fixed;
      right: 27px;
      top: 17px;
      z-index: 950;

      border-radius: 100%;
      border: 1px solid white;
      background-image: linear-gradient(to bottom, #50C9C3 20%, #56C596 100%);
    }
  }

  .menu {
    width: 40vw;
    height: 100%;

    display: flex;
    justify-content: flex-end;
    align-items: center;

    button {
      width: 100px;
      height: 100%;

      border: none;
      background-color: white;
      font-size: 12pt;
      font-weight: bold;
      color: #777;

      cursor: pointer;
      
      &:hover {
        border-bottom: 3px solid #50C9C3;
        /* background: linear-gradient(180deg, #fff 95%, #50C9C3 5%); */
      }
    }
  }
`;

export default function TopNav () {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLoggedIn
  );

  const handleModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispatch(modalChanger(e.currentTarget.className))
  }

  const isBadgeOn = useSelector(
    (state: AppState) => state.notifyReducer.isBadgeOn
  );

  return (
    <NavContainer>
      <button id="logo">
        <Link to="/">
          <img src="img/navLogo.png" alt="logo" />
        </Link>
      </button>
      {isLoggedIn ?
        <div className="userMenu">
          <button>
            <Link to="/search" style={{ color: "#777", textDecoration: "none" }}>
              <FontAwesomeIcon icon={ faSearch } className="icon" /> 
            </Link>  
          </button>
          {window.location.pathname === "/notification" ?
            <button
             onClick={() => navigate(-1)}
            >
              <FontAwesomeIcon icon={ faBell } className="icon" onClick={() => navigate(-1)} />
            </button>
          : <button>
              <Link to="/notification" style={{ color: "#777", textDecoration: "none" }}>
                {isBadgeOn ? <div id="notification" /> : null}
                <FontAwesomeIcon icon={ faBell } className="icon" />
              </Link>
            </button>}
        </div>
      : <div className="menu">
          <button className='signinModalBtn' onClick={(e) => handleModal(e)}>로그인</button>
          <button className='signupModalBtn' onClick={(e) => handleModal(e)}>회원가입</button>
        </div> 
      }
    </NavContainer>
  );
}
