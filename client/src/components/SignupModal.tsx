import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faCamera } from '@fortawesome/free-solid-svg-icons';

import { RootReducerType } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserdata } from '../actions/signin';
import { modalChanger } from '../actions/modal';

import Loading from './Loading';
import UserMap from './UserMap';

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

  table {
    td {
      height: 50px;
    }

    .label {
      font-size: 0.9rem;
      font-weight: bold;
    }

    .input, .info {
      width: 186px;
      font-size: 0.9rem;
    }

    .input {
      padding: 0 8px;

      input {
        border: none;
        border-bottom: 1px solid #d5d5d5;

        width: 170px;
        height: 25px;

        text-align: center; 
      }

      input[type=date] {
        font-family: "-apple-system";
      }

      select {
        width: 170px;
        text-align: center;

        border: none;
        border-bottom: 1px solid #d5d5d5;
      }
    }
  }

  .confirm {
    margin: 5px 0;
  }

  .error {
    font-size: 0.7rem;
    color: #f34508;

    margin-top: 5px;
  }
`

export const UserImage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  justify-content: center;

  margin: 5vh 0;

  .label {
    margin: 1vh 0;
  }

  .circle {
    width: 140px;
    height: 140px;
    margin: 0 auto;
    border-radius: 100% !important;
    border: 1px solid darkcyan;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pic {
    width: 200px;
    max-height: 200px;
    display: inline-block;
    margin: auto;
  }
  .imgUpload {
    display: none;
  }
  img {
    max-width: 100%;
    height: auto;
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

export const BtnContainer = styled.section`
  width: 100%;
  margin-top: 20px;

  display: flex;
  justify-content: space-between;

  button {
    width: 90px;
    height: 40px;

    border: none;
    border-radius: 10px;

    cursor: pointer;
  }
`

const SignupModal = () => {
  const dispatch = useDispatch();
  const cameraRef = useRef<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [pageIdx, setPageIdx] = useState(0)

  type Info = {
    profileImage: any;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    gender: string;
    birth: string;
    mobile: string;
    address: string;
  };

  const [userInfo, setUserInfo] = useState<Info>({
    profileImage: 'img/defaultThumbnail.png',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: '',
    birth: '',
    mobile: '',
    address: ''
  });

  const [isError, setIsError] = useState({
    isEmail: false,
    isName: false,
    isGender: false,
    isBirth: false,
    isMobile: false,
    isAxios: false,

    emailMsg: '',
    nameMsg: '',
    genderMsg: '',
    birthMsg: '',
    mobileMsg: '',
    axiosMsg: ''
  });

  const [isPassword, setIsPassword] = useState({
    isValid: false,
    passwordMsg: '',
  })

  const [isConfirmPassword, setIsConfirmPassword] = useState({
    isValid: false,
    confirmPasswordMsg: '',
  })

  const [fixedLocation, setFixedLocation] = useState('');
  const [formatAddress, setFormatAddress] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const {name, value} = e.target;

    const regex={
      email: /\S+@\S+\.\S+/,
      password: /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W).{8,16}$)/,
      mobile: /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/
    };

    setUserInfo({
      ...userInfo,
      [name]: value
    });

    if(name === 'email'){
      if(!regex.email.test(value)){
        setIsError({
          ...isError,
          isEmail: false,
          emailMsg: '유효하지 않은 이메일 형식입니다.'
        })
      } else {
        setIsError({
          ...isError,
          isEmail: true,
          emailMsg: ''
        })
      }
    };

    if(name === 'password'){
      if(!regex.password.test(value)){
        setIsPassword({
          isValid: false,
          passwordMsg: `숫자/영문자/특수문자를 포함한 8~16자리의 비밀번호여야 합니다.`
        })
      } else {
        setIsPassword({
          isValid: true,
          passwordMsg: '',
        })
      }

      if(userInfo.confirmPassword !== value){
        setIsConfirmPassword({
          isValid: false,
          confirmPasswordMsg: '비밀번호가 일치하지 않습니다.',
        })
      } else {
        setIsConfirmPassword({
          isValid: true,
          confirmPasswordMsg: '',
        })
      }
    };

    if(name === 'confirmPassword'){
      if(userInfo.password !== value){
        setIsConfirmPassword({
          isValid: false,
          confirmPasswordMsg: '비밀번호가 일치하지 않습니다.',
        })
      } else {
        setIsConfirmPassword({
          isValid: true,
          confirmPasswordMsg: '',
        })
      }
    };

    if(name === 'mobile'){
      if(!regex.mobile.test(value)){
        setIsError({
          ...isError,
          isMobile: false,
          mobileMsg: "'-'를 포함하여 입력해주세요."
        })
      } else {
        setIsError({
          ...isError,
          isMobile: true,
          mobileMsg: ''
        })
      }
    };
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target

    setUserInfo({
      ...userInfo,
      [name]: value
    });
  }

  function getCurrentDate() {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    return `${year}-${month<10?`0${month}`:`${month}`}-${date}`
  }

  const handleFormatAddressChange = (address: string) => {
    setFormatAddress(address);
  }

  const handleSearchLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.code === 'Enter' || e.code === 'Space' || e.code == 'ArrowRight') {
      setFixedLocation(userInfo.address);
    }
  }

  const handleSignup = () => {
    const {profileImage, email, password, name, gender, birth, mobile, address} = userInfo
    const {isEmail, isName, isGender, isBirth, isMobile} = isError

    if(!email || !password || !name || !gender || !birth || !mobile || !address) {
      setIsError({
        ...isError,
        isAxios: true,
        axiosMsg: '작성이 완료되지 않은 정보가 있습니다.'
      })
    } else if(!isEmail || !isPassword.isValid || !isConfirmPassword.isValid || !isName || !isGender || !isBirth || !isMobile) {
      setIsError({
        ...isError,
        isAxios: true,
        axiosMsg: '입력하신 정보가 올바른지 확인해주세요.'
      })
    }
    else {
      axios.post(`${process.env.REACT_APP_API_URL}/signup`,{
        userInfo: {
          profileImage,
          email,
          password,
          birth,
          gender,
          mobile,
          address
        }
      })
      .then((res) => {
        if(res.data.message === 'Already Signed Up') {
          setIsError({
            ...isError,
            isAxios: true,
            axiosMsg: '이미 가입된 이메일 주소입니다.'
          })
        } else {
          dispatch(modalChanger('signinModalBtn'))
        }
      })
      .catch((err) => console.log(err))
    }
  }

  const handleNextPage = () => {
    if(pageIdx < 3) {
      setPageIdx(pageIdx + 1)
    }
  }
  const handlePrevPage = () => {
    if(pageIdx > 0) {
      setPageIdx(pageIdx - 1)
    }
  }

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dispatch(modalChanger(e.currentTarget.className))
  }

  const handleImgLoad = async (e: any) => {
    setIsLoading(true)
    e.preventDefault();
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append('profileImage', file)
    const res = await axios.post('이미지서버', formData)
    //res.data.location 에 있는 url을 img의 src로 바꿔야 합니다.
    setIsLoading(false)
  }

  const handleRefClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    cameraRef.current.click();
  }

  if(isLoading){
    return <Loading />
  }

  return(
    <ModalContainer>
      <ModalBackdrop>
        <ModalView>
          <CloseBtn><div className='closeModalBtn' onClick={(e) => closeModal(e)}><FontAwesomeIcon icon={faTimes} /></div></CloseBtn>
          <header>
            <div className="title">Sign Up</div>
          </header>
          {(() => {
            if(pageIdx === 0) {
              return (
                <table>
                  <tr>
                    <td className='label'>이메일</td>
                    <td className='input'>
                      <input 
                        type='email'
                        name='email'
                        value={userInfo.email}
                        onChange={(e) => handleInputChange(e)}
                      />
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
                      <div className='error'>{isPassword.passwordMsg}</div>
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
                      <div className='error'>{isConfirmPassword.confirmPasswordMsg}</div>
                    </td>
                  </tr>
                </table>
              )
            }
            else if(pageIdx === 1) {
              return (
                <table>
                  <tr>
                    <td className='label'>닉네임</td>
                    <td className='input'>
                      <input
                        type='text'
                        name='name'
                        value={userInfo.name}
                        onChange={(e) => handleInputChange(e)}
                      />
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
                      <option value='none' selected={true} disabled={true}>선택</option>
                      <option value='남성'>남성</option>
                      <option value='여성'>여성</option>
                      <option value='기타'>기타</option>
                    </select>
                    <div className='error'>{isError.genderMsg}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className='label'>생일</td>
                    <td className='input'>
                      <input
                        type='date'
                        name='birth'
                        max={getCurrentDate()}
                        value={userInfo.birth}
                        onChange={(e) => handleInputChange(e)}
                      />
                      <div className='error'>{isError.birthMsg}</div>
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
                        placeholder="'-'을 포함하여 입력해주세요."
                      />
                      <div className='error'>{isError.mobileMsg}</div>
                    </td>
                  </tr>
                </table>
              )
            }
            else if(pageIdx === 2) {
              return (
                <div className='mapContainer'>
                  <div id='map' className='mapDesc'>
                    <UserMap 
                      location={fixedLocation} 
                      image={userInfo.profileImage} 
                      handleFormatAddressChange={handleFormatAddressChange}
                    />
                  </div>
                  <input 
                    className='mapInput'
                    name='location'
                    type='text'
                    value={userInfo.address}
                    onChange={(e) => handleInputChange(e)}
                    onKeyUp={(e) => handleSearchLocation(e)}
                  />
                </div>
              )
            }
            else if(pageIdx === 3) {
              return (
                <>
                  <div className='confirm'>이 정보가 맞나요?</div>
                  <div className='image'></div>
                  <table>
                    <tr>
                      <td className='label'>이메일</td>
                      <td className='info'>{userInfo.email}</td>
                    </tr>
                    <tr>
                      <td className='label'>닉네임</td>
                      <td className='info'>{userInfo.name}</td>
                    </tr>
                    <tr>
                      <td className='label'>젠더</td>
                      <td className='info'>{userInfo.gender}</td>
                    </tr>
                    <tr>
                      <td className='label'>생일</td>
                      <td className='info'>{userInfo.birth}</td>
                    </tr>
                    <tr>
                      <td className='label'>전화번호</td>
                      <td className='info'>{userInfo.mobile}</td>
                    </tr>
                    <tr>
                      <td className='label'>주소</td>
                      <td className='info'>{formatAddress}</td>
                    </tr>
                  </table>
                  <div className='error'>{isError.axiosMsg}</div>
                </>
              )
            }
          })()}

          {/* [dev] 페이지네이션 버튼 */}
          {(() => {
            if(pageIdx === 0) {
              return (
                <BtnContainer style={{ justifyContent: "flex-end" }}>
                  <button onClick={handleNextPage}>next</button> 
                </BtnContainer>
              )
            }
            else if(pageIdx === 3) {
              return (
                <BtnContainer>
                  <button onClick={handlePrevPage}>prev</button>
                  <button onClick={handleSignup}>Sign Up</button>
                </BtnContainer>
              )
            }
            else {
              return (
                <BtnContainer>
                  <button onClick={handlePrevPage}>prev</button>
                  <button onClick={handleNextPage}>next</button>
                </BtnContainer>
              )
            }
          })()}
        </ModalView>
      </ModalBackdrop>
    </ModalContainer>
  )
}

export default SignupModal;