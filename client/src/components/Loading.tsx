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

export const Backdrop = styled.div`
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
    color: #777;
  }

  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }

  .lds-ellipsis div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #777;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

    .lds-ellipsis div:nth-child(1) {
        left: 8px;
        animation: lds-ellipsis1 0.6s infinite;
    }

    .lds-ellipsis div:nth-child(2) {
        left: 8px;
        animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(3) {
        left: 32px;
        animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(4) {
        left: 56px;
        animation: lds-ellipsis3 0.6s infinite;
    }

    @keyframes lds-ellipsis1 {
        0% {
            transform: scale(0);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes lds-ellipsis3 {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(0);
        }
    }
    @keyframes lds-ellipsis2 {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(24px, 0);
        }
    }

`;

export default function Loading() {
  return (
    <LoadingContainer>
      <Backdrop>
        <div className="lds-ellipsis">
          <div>
          </div>
          <div>
          </div>
          <div>
          </div>
          <div>
          </div>
        </div>
        <div className="text">Loading...</div>
      </Backdrop>
    </LoadingContainer>
  );
}
