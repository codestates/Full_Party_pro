import React from 'react';
import styled from 'styled-components';

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

  .closeBtn {
    text-align: right;
  }

  .header {
    font-size: 25px;
    margin: 1.5vh 0;
  }

  fieldset {
    border: none;
    margin: 1.5vh 0;
  }

  input {
    width: 60vw;
    height: 4vh;

    border: 1px solid #d5d5d5;
    border-radius: 20px;

    text-align: center;
  }

  button {
    width: 60vw;
    height: 5vh;

    border: none;
    border-radius: 20px;
    background-image: linear-gradient(to right, #329D9C 20%, #56C596 100%);
    color: white;

    font-size: 15px;
    margin: 1.5vh 0;
  }

  .toSignupHL {
    color: #56C596;
  }

  .error {
    color: red;
    font-size: 9px;
    margin-top: 0.5vh;
  }
  .notUser{
    color: red;
    font-size: 9px;
  }
`

// 타입은 스타일드 컴포넌트와 컴포넌트 함수 export 전에 정의
type Props = {
  signinModalHandler: Function,
}

const SigninModal = ({ signinModalHandler }: Props) => {
  const handleSignin = () => {
    console.log('로그인한다네')
  }

  const handleInput = () => {
    console.log('상태가 바뀐다네')
  }
  const closeModal =() => {
    signinModalHandler();
  }

  return(
    <ModalContainer>
      <ModalBackdrop>
        <ModalView>
          <div className='closeBtn' onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></div>
          <div className='header'>
            <div>Sign in</div>
            <div>1st player</div>
          </div>
          <fieldset>
            <div className='label'>email</div>
            <input
              type='text'
              name='email'
              // value={}
              onChange={(e) => handleInput()}
            />
            <div className='error'>
              올바른 이메일을 입력하세요
            </div>
          </fieldset>
          <fieldset>
            <div className='label'>password</div>
            <input
              type='text'
              name='password'
              // value={}
              onChange={(e) => handleInput()}
            />
            <div className='error'>
              숫자/영문자/특수문자를 포함한<br />8~16자리의 비밀번호여야 합니다
            </div>
          </fieldset>
          <div className='notUser'>입력하신 이메일 또는 비밀번호가 존재하지 않습니다</div>
          <div className='footer'>
            <button className='signinBtn' onClick={handleSignin}>
              Press Button
            </button>
            <section className='toSignup'>
              아직 풀팟의 파티원이 아니세요?<br />
              지금 바로 <span className='toSignupHL'>회원가입</span> 하세요 🥳
            </section>
          </div>
        </ModalView>
      </ModalBackdrop>
    </ModalContainer>
  )
}

export default SigninModal;