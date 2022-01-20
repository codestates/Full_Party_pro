import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  header {
    font-size: 25px;
    margin-bottom: 15px;

    font-family: 'SilkscreenBold';
  }

  .error {
    font-size: 0.7rem;
    color: #f34508;

    margin-top: 5px;
  }

  img {
    width: 50px;
    height: 50px;
  }

  .title {
    font-weight: bold;
    margin-bottom: 5px;
    margin-top: 10px;
  }

  input {
    width: 100%;
    height: 25px;
    border: none;
    border-bottom: 1px solid #d5d5d5;

    margin: 15px 0;
  }

  button {
    width: 90px;
    height: 40px;

    border: none;
    border-radius: 10px;

    background-color: #50C9C3;
    color: #fff;

    cursor: pointer;
  }
`

type Props = {
  verficationModalHandler: Function
}

const VerificationModal = ({ verficationModalHandler }: Props) => {

  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleVerification = (e: React.MouseEvent<HTMLButtonElement>) => {
    //[dev] 비밀번호 인증

    // await axios.post(`${process.env.REACT_APP_API_URL}/user/verification`, {
    //   userInfo: {
    //     userId: "", 
    //     email: "",
    //     password: "",
    //   }
    // }
  }

  return(
    <ModalContainer>
      <ModalBackdrop onClick={(e) => verficationModalHandler(e)}>
        <ModalView>
          <div className="mapInfo">
            <img src="img/404logo.png" alt="logo" />
            <div className="title">비밀번호를 입력해주세요.</div>
          </div>
          <input 
            className='mapInput'
            name='password'
            type='text'
            value={password}
            onChange={(e) => handleInputChange(e)}
          />
          <button className="request">제출</button>
        </ModalView>
      </ModalBackdrop>
    </ModalContainer>
  )
}

export default VerificationModal;