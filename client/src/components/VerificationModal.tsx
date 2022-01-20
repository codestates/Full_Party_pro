import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export const ModalContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow: auto;
  z-index: 1000;
`;

export const ModalBackdrop = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.4);

  display: flex;
  justify-content: center;
  align-items: center;
`

export const ModalView = styled.div`
  width: 80%;
  max-width: 350px;
  max-height: 90vh;
  overflow: auto;

  border-radius: 30px;
  background-color: white;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

  padding: 30px;
  text-align: center;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .error {
    font-size: 0.7rem;
    color: #f34508;

    margin-top: 10px;
  }

  img {
    width: 50px;
    height: 50px;

    margin-bottom: 5px;
  }

  .title {
    font-weight: bold;
    margin-bottom: 5px;
    margin-top: 10px;
  }

  input {
    width: 200px;
    height: 25px;
    border: none;
    border-bottom: 1px solid #d5d5d5;

    margin-top: 15px;

    text-align: center;
  }

  .request {
    width: 90px;
    height: 40px;

    border: none;
    border-radius: 10px;

    background-color: #50C9C3;
    color: #fff;

    cursor: pointer;

    margin-top: 10px;
  }
`

export const CloseBtn = styled.button`

  width: 100%;
  text-align: right;

  cursor: pointer;
  margin-bottom: 10px;

  background-color: white;
  border: none;

`

type Props = {
  userId: number,
  handleIsChange: Function,
  verficationModalHandler: Function
}

const VerificationModal = ({ userId, handleIsChange, verficationModalHandler }: Props) => {

  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const closeModal =() => {
    verficationModalHandler();
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleVerification = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const verify = await axios.post(`${process.env.REACT_APP_API_URL}/user/verification`, {
      userInfo: {
        userId: userId,
        password: password
      }
    })

    if(verify.data.message === "Unauthorized User"){
      setErrorMsg('비밀번호가 틀렸습니다. 다시 확인해주세요.');
    } else if(verify.data.message === "User Identified"){

      handleIsChange();
    }
  }

  return(
    <ModalContainer>
      <ModalBackdrop onClick={closeModal}>
        <ModalView onClick={(e) => e.stopPropagation()}>
          <CloseBtn onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></CloseBtn>
            <img src="img/404logo.png" alt="logo" />
            <div className="title">비밀번호를 입력해주세요.</div>
            <input 
              name='password'
              type='password'
              value={password}
              onChange={(e) => handleInputChange(e)}
            />
            <div className="error">{errorMsg}</div>
            <button onClick={handleVerification} className="request">제출</button>
        </ModalView>
      </ModalBackdrop>
    </ModalContainer>
  )
}

export default VerificationModal;