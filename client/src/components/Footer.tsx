import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCodeBranch } from '@fortawesome/free-solid-svg-icons';

export const FooterContainer = styled.footer`
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

  /* width: 98.9vw; */

/* position: absolute;
left: 0;

padding: 4vh;
box-shadow: rgba(149, 157, 165, 0.4) 0px 8px 24px;

font-size: 1rem;
line-height: 2rem;

z-index: 1000;

.title {
  font-weight: bold;
}

.teamMembers {
  margin-bottom: 1.5vh;
}

a {
  color: black;
  text-decoration: none;
} */
`;

export default function Footer () {

  return (
    <FooterContainer>
      <div className="teamMembers">
        <div className="title">
          코드스테이츠 34기
          <br />파이널 프로젝트 "풀팟"
        </div>
        팀원: 조범, 김아영, 정재현, 조영현
      </div>
      <div className="contact">
        <div className="title">Contact Us</div>
        <FontAwesomeIcon icon={ faEnvelope } /> reindeer1604@gmail.com
        <br /><FontAwesomeIcon icon={ faCodeBranch } /> <a href="https://github.com/codestates/Full_Party_pro/wiki" target="_blank" rel="noreferrer">https://github.com/codestates/Full_Party_pro</a>
      </div>  
    </FooterContainer>
  );
}