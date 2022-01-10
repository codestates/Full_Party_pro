import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';

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

    font-family: 'SilkscreenBold';
  }

  .profileBox {
    display: flex;
    width: 100px;
    height: 100px;

    margin: auto;

    justify-content: center;
    align-items: center;

    border: 1px solid grey;
    border-radius: 100%;
  }

  table {
    text-align: center;
    margin: 0.5vh auto;
  }

  .label {
    padding-right: 20px;
    white-space:nowrap;
    margin-top: 1vh;

    font-family: "DungGeunMo";
    font-size: 14px;
    font-weight: medium;
  }

  input {
    width: 40vw;
    height: 3vh;

    border: none;
    border-bottom: 1px solid #d5d5d5;
  }

  select {
    width: 40vw;
    height: 3vh;

    border: none;
    border-bottom: 1px solid #d5d5d5;

    text-align: center;
  }

  .error {
    color: red;
    font-size: 12px;
  }

  button {
    width: 60vw;
    height: 5vh;

    border: none;
    border-radius: 20px;
    background-image: linear-gradient(to right, #329D9C 20%, #56C596 100%);
    color: white;

    font-family: 'SilkscreenRegular';
    font-size: 15px;
    margin: 1.5vh 0;
  }
`

const SignupModal = () => {
  const [userInfo, setUserInfo] = useState({
    profileImage: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: '',
    birth: '',
    mobile: '',
    region: ''
  })

  const [isError, setIsError] = useState({
    isEmail: false,
    isPassword: false,
    isConfirmPassword: false,
    isName: false,
    isGender: false,
    isBirth: false,
    isMobile: false,
    isRegion: false,
    isAxios: false,

    emailMsg: '',
    passwordMsg: '',
    confirmPasswordMsg: '',
    nameMsg: '',
    genderMsg: '',
    birthMsg: '',
    mobileMsg: '',
    regionMsg: '',
    axiosMsg: ''
  })
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex={
      email: /\S+@\S+\.\S+/,
      password: /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W).{8,16}$)/,
      mobile: /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/
    };
    const {name, value} = e.target

    setUserInfo({
      ...userInfo,
      [name]: value
    });

    if(name === 'email'){
      if(!regex.email.test(value)){
        setIsError({
          ...isError,
          isEmail: true,
          emailMsg: '유효하지 않은 이메일 형식입니다'
        })
      } else {
        setIsError({
          ...isError,
          isEmail: false,
          emailMsg: ''
        })
      }
    };

    if(name === 'password'){
      if(!regex.password.test(value)){
        setIsError({
          ...isError,
          isPassword: true,
          passwordMsg: '숫자/영문자/특수문자를 포함한 8~16자리의 비밀번호여야 합니다'
        })
      } else {
        setIsError({
          ...isError,
          isPassword: false,
          passwordMsg: ''
        })
      }
    };

    if(name === 'confirmPassword'){
      if(userInfo.password !== userInfo.confirmPassword){
        setIsError({
          ...isError,
          isConfirmPassword: true,
          confirmPasswordMsg: '비밀번호가 일치하지 않습니다'
        })
      } else {
        setIsError({
          ...isError,
          isConfirmPassword: false,
          confirmPasswordMsg: ''
        })
      }
    };

    if(name === 'mobile'){
      if(!regex.mobile.test(value)){
        setIsError({
          ...isError,
          isMobile: true,
          mobileMsg: '"-"을 포함하여 입력해 주세요'
        })
      } else {
        setIsError({
          ...isError,
          isMobile: false,
          mobileMsg: ''
        })
      }
    };

    if(name ==='name'){
      if(userInfo.name.length >= 2){
        setIsError({
          ...isError,
          isName: false,
          nameMsg: ''
        })
      }
    }
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target

    setUserInfo({
      ...userInfo,
      [name]: value
    });

    if(name === 'gender'){
      if(userInfo.gender === '남성' || userInfo.gender === '여성' || userInfo.gender === '기타'){
        setIsError({
          ...isError,
          isGender: false,
          genderMsg: ''
        })
      }
    }
  }

  const handleSignin = () => {
    const {isEmail, isPassword, isConfirmPassword, isName, isGender, isBirth, isMobile, isRegion} = isError

    if(userInfo.name.length < 2) {
      setIsError({
        ...isError,
        isName: true,
        nameMsg: '닉네임은 2자이상 12자 이하여야 합니다'
      })
    }
    else if (userInfo.gender === '' || userInfo.gender === 'none'){
      setIsError({
        ...isError,
        isGender: true,
        genderMsg: '성별을 선택해 주세요'
      })
    }
    else if(isEmail || isPassword || isConfirmPassword || isName || isGender || isBirth || isMobile || isRegion) {
      setIsError({
        ...isError,
        isAxios: true,
        axiosMsg: '입력한 정보를 확인하세요'
      })
    } else {
      axios.post('http://localhost:3000',{
        userInfo: {
          email: userInfo.email,
          password: userInfo.password,
          birth: userInfo.birth,
          gender: userInfo.gender,
          mobile: userInfo.mobile,
          region: userInfo.region
        }
      })
      .then((res) => {
        if(res.data.message === 'Already Signed Up') {
          setIsError({
            ...isError,
            isAxios: true,
            axiosMsg: '이미 가입된 계정입니다'
          })
        } else {
          console.log('대충 로그인창으로 보내는 이야기')
        }
      })
      .catch((err) => console.log(err))
    }
  }

  return(
    <ModalContainer>
      <ModalBackdrop>
        <ModalView>
          <div className='closeBtn' onClick={handleSignin}><FontAwesomeIcon icon={faTimes} /></div>
          <div className='header'>
            <div>Sign Up</div>
          </div>
          <div className='userInfo'>
            <div className='profileBox'>
              <div className='addImage'><FontAwesomeIcon icon={faPlus} /></div>
            </div>
            <table>
              <tbody>
                <tr>
                  <td className='label'>이메일</td>
                  <td className='input'>
                    <input 
                      type='email'
                      name='email'
                      value={userInfo.email}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td />
                  <td>
                    <div className='error'>{isError.emailMsg}</div>
                  </td>
                </tr>
                <tr>
                  <td className='label'>비밀번호</td>
                  <td className='input'>
                    <input
                      type='password'
                      name='password'
                      value={userInfo.password}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td />
                  <td>
                    <div className='error'>{isError.passwordMsg}</div>
                  </td>
                </tr>
                <tr>
                  <td className='label'>비밀번호<br />확인</td>
                  <td className='input'>
                    <input
                      type='password'
                      name='confirmPassword'
                      value={userInfo.confirmPassword}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td />
                  <td>
                    <div className='error'>{isError.confirmPasswordMsg}</div>
                  </td>
                </tr>
                <tr>
                  <td className='label'>닉네임</td>
                  <td className='input'>
                    <input
                      type='text'
                      name='name'
                      value={userInfo.name}
                      onChange={(e) => handleInputChange(e)}
                      minLength={2}
                      maxLength={12}
                    />
                  </td>
                </tr>
                <tr>
                  <td />
                  <td>
                    <div className='error'>{isError.nameMsg}</div>
                  </td>
                </tr>
                <tr>
                  <td className='label'>젠더</td>
                  <td className='input'>
                    <select
                      name='gender'
                      value={userInfo.gender}
                      onChange={(e) => handleSelectChange(e)}
                      id='gender'
                    >
                      <option value='none' selected disabled>선택</option>
                      <option value='남성'>남성</option>
                      <option value='여성'>여성</option>
                      <option value='기타'>기타</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td />
                  <td>
                    <div className='error'>{isError.genderMsg}</div>
                  </td>
                </tr>
                <tr>
                  <td className='label'>생년월일</td>
                  <td className='input'>
                    <input
                      type='date'
                      name='birth'
                      value={userInfo.birth}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td />
                  <td>
                    <div className='error'>생년월일을 선택해주세요</div>
                  </td>
                </tr>
                <tr>
                  <td className='label'>전화번호</td>
                  <td className='input'>
                    <input
                      type='tel'
                      name='mobile'
                      value={userInfo.mobile}
                      onChange={(e) => handleInputChange(e)}
                      placeholder='"-"을 포함하여 입력하세요'
                    />
                  </td>
                </tr>
                <tr>
                  <td />
                  <td>
                    <div className='error'>{isError.mobileMsg}</div>
                  </td>
                </tr>
                <tr>
                  <td className='label'>지역</td>
                  <td className='input'>
                    <input
                      type='text'
                      name='region'
                      value={userInfo.region}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td />
                  <td>
                    <div className='error'>올바른 주소를 입력해 주세요</div>
                  </td>
                </tr>
              </tbody>
            </table>
            <button className='signupBtn' onClick={handleSignin}>
              Sign up
            </button>
            <div className='error'>{isError.axiosMsg}</div>
          </div>
        </ModalView>
      </ModalBackdrop>
    </ModalContainer>
  )
}

export default SignupModal;