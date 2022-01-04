import React from 'react';
import styled from 'styled-components';

export const ModalContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottm: 0;
  overflow: auto;
  z-index: 1000;
`;

export const ModalBackdrop = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(169, 169, 169, 0.7);

  display: flex;
  justify-content: center;
  align-items: center;
`

//모달 내부 CSS를 건드려주세요.
export const ModalView = styled.div`
  width: 80%;
  position: absolute;

  border-radius: 20px;
  background-color: white;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

  padding: 3vh;
  text-align: center;

  .header {
    font-size: 25px;
    margin: 1.5vh 0;
  }
`

const Modal = () => {
  
  // 함수를 및 상태를 만들어주세요
  const sampleFunc = () => {
    console.log('함수가 작동한다네')
  }

  return(
    <ModalContainer>
      <ModalBackdrop>
        <ModalView>
          <div className='header'>
            <div onClick={sampleFunc}>Hello World</div>
          </div>
        </ModalView>
      </ModalBackdrop>
    </ModalContainer>
  )
}

export default Modal;