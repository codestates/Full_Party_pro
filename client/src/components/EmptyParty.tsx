import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear } from "@fortawesome/free-solid-svg-icons";

export const CardContainer = styled.div`
  width: 100%;
  height: 250px;
  border-radius: 25px;
  margin: 15px 0;
  background-color: #d5d5d5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 1.2rem;
  font-weight: bold;

  .iconContainer {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  @media screen and (max-width: 450px) {
    height: 200px;
  }
`;

export default function EmptyParty () {

  return (
    <CardContainer>
      <div className="iconContainer"><FontAwesomeIcon icon={ faSadTear } /></div>
      조건에 일치하는 파티가 없어요
    </CardContainer>
  );
}
