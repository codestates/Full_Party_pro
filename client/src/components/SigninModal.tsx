import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
// const dotenv = require('dotenv').config();

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { RootReducerType } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserdata } from '../actions/signin';
import { modalChanger } from '../actions/modal';
import { useEffect } from 'react';

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
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(169, 169, 169, 0.7);

  display: flex;
  justify-content: center;
  align-items: center;
`

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

    font-family: 'SilkscreenBold';
  }

  fieldset {
    border: none;
    margin: 1.5vh 0;
  }

  .label {
    margin: 0.5vh 0;

    font-family: 'SilkscreenRegular';
  }

  input {
    width: 60vw;
    height: 4vh;

    border: 1px solid #d5d5d5;
    border-radius: 20px;

    text-align: center;
  }

  .signinBtn {
    width: 60vw;
    height: 5vh;

    border: none;
    border-radius: 20px;
    background-image: linear-gradient(to right, #329D9C 20%, #56C596 100%);
    color: white;

    font-family: 'SilkscreenBold';
    font-size: 15px;
    margin: 1.5vh 0;
  }

  .signupModalBtn {
    color: #56C596;
  }

  .toSignup {
    font-size: 13px;
  }

  .notUser{
    color: red;
    font-size: 9px;
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
  signinModalHandler: Function,
}

const SigninModal = ({ signinModalHandler }: Props) => {
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: ''
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setUserInfo({
      ...userInfo,
      [name]: value
    })
  }

  const signinReducer = useSelector((state: RootReducerType) => state.signinReducer)

  const handleSignin = () => {
    dispatch(fetchUserdata(userInfo))
  }

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dispatch(modalChanger(e.currentTarget.className))
  }

  const signupModal = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    dispatch(modalChanger(e.currentTarget.className))
  }

  // const getCode = () => {
  //   const code = new URL(window.location.href).searchParams.get("code");

  //   return String(code);
  // };

  const handleKakao = async () => {
    // console.log(process.env.REACT_APP_KAKAO_REST_API_KEY);
    // console.log(process.env.REACT_APP_REDIRECT_URI);
    // window.location.assign(
    //   `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`
    // );
  };

  return(
    <ModalContainer>
      <ModalBackdrop>
        <ModalView>
          <CloseBtn><div className='closeModalBtn' onClick={(e) => closeModal(e)}><FontAwesomeIcon icon={faTimes} /></div></CloseBtn>
          <div className='header'>
            <div>Sign in</div>
            <div>1st player</div>
          </div>
          <fieldset>
            <div className='label'>email</div>
            <input
              type='text'
              name='email'
              value={userInfo.email}
              onChange={(e) => handleInput(e)}
            />
          </fieldset>
          <fieldset>
            <div className='label'>password</div>
            <input
              type='text'
              name='password'
              value={userInfo.password}
              onChange={(e) => handleInput(e)}
            />
          </fieldset>
          {signinReducer.isLogin === false ? <div className='notUser'>입력하신 아이디 혹은 비밀번호가 유효하지 않습니다</div> : <span />}
          <div className='footer'>
            <button className='signinBtn' onClick={handleSignin}>
              Press Start
            </button>
          <div>
            <a 
              href={`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`}>
              <button>
                카카오 로그인
              </button>
            </a>
          </div>
            <section className='toSignup'>
              아직 풀팟의 파티원이 아니세요?<br />
              지금 바로 <span className='signupModalBtn' onClick={(e) => signupModal(e)}>회원가입</span> 하세요 🥳
            </section>
          </div>
        </ModalView>
      </ModalBackdrop>
    </ModalContainer>
  )
}

export default SigninModal;