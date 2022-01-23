import React from 'react';
import styled from 'styled-components';

export const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  outline: none;
  z-index: 1000;
`;

export const LoadingBackdrop = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(255,255,255,0.8);
  padding-top: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .text {
    font-family: 'SilkscreenBold';
    color: #50C9C3;
  }

  img {
    width: 50px;
    height: 50px;
    margin-bottom: 15px;
  }
`;

export default function Loading() {

  return (
    <LoadingContainer>
      <LoadingBackdrop>
        <img src="img/loadingLogo.gif" />
        <div className="text">Loading...</div>
      </LoadingBackdrop>
    </LoadingContainer>
  );
}
