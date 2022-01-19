import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faCamera } from '@fortawesome/free-solid-svg-icons';
import { RootReducerType } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserdata } from '../actions/signin';
import { modalChanger } from '../actions/modal';
import Loading from './Loading';

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

  header {
    font-size: 25px;
    margin-bottom: 15px;

    font-family: 'SilkscreenBold';
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
    font-family: "DungGeunMo";
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
export const Camera = styled.div`
  margin: 10px 0;
  .faCamera {
    font-size: 25px;
    color: #888;
    transition: all 0.3s
  }
  .faCamera:hover {
    color: black;
  }
`

export const UserID = styled.table`
  width: 100%;
  text-align: center;
  margin: 5vh 0;

  .label {
    padding-right: 20px;
    white-space: nowrap;

    font-family: "DungGeunMo";
    font-size: 14px;
    font-weight: medium;
  }

  input {
    width: 40vw;
    max-width: 450px;
    height: 3vh;

    border: none;
    border-bottom: 1px solid #d5d5d5;
  }

  .error {
    color: red;
    font-size: 12px;
  }
`

export const UserInfo = styled.table`
  width: 100%;
  text-align: center;
  margin: 5vh 0;

  .label {
    padding-right: 20px;
    white-space: nowrap;

    font-family: "DungGeunMo";
    font-size: 14px;
    font-weight: medium;
  }

input {
  width: 40vw;
  max-width: 450px;
  height: 3vh;
  text-align: center;

  background-color: white;

  border: none;
  border-bottom: 1px solid #d5d5d5;
}

select {
  width: 40vw;
  max-width: 450px;
  height: 3vh;

  background-color: white;

  border: none;
  border-bottom: 1px solid #d5d5d5;

  text-align: center;
}

.error {
  color: red;
  font-size: 12px;
}
`

export const UserRegion = styled.div`
  width: 100%
`

export const UserCheck = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  align-items: center;

  font-family: 'DungGeunMo';

  .header {
    margin: 1vh 0;

    font-family: 'DungGeunMo';
    font-size: 17px;
  }

  .image {
    width: 90px;
    height: 90px;

    margin: 1vh 0;
    margin-bottom: 3vh;

    border: 1px solid black;
    border-radius: 100%;
  }
  
  table {
    text-align: center;
    border-spacing: 15px;
  }
  
  .error {
    font-size: 13px;
    color: red;
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
  const [isLoading, setIsLoading] = useState(false)
  type Info = {
    profileImage: any;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    gender: string;
    birth: string;
    mobile: string;
    region: string;
  };
  const [userInfo, setUserInfo] = useState<Info>({
    profileImage: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: '',
    birth: '',
    mobile: '',
    region: ''
  });
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
  });

  const [pageIdx, setPageIdx] = useState(0)
  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  const date = year + '-' + month + '-' + day

  
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
          passwordMsg: `숫자/영문자/특수문자를 포함한 8~16자리의 비밀번호여야 합니다`
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

  const handleSignup = () => {
    const {profileImage, email, password, name, gender, birth, mobile, region} = userInfo
    const {isEmail, isPassword, isConfirmPassword, isName, isGender, isBirth, isMobile, isRegion} = isError

    if(isEmail || isPassword || isConfirmPassword || isName || isGender || isBirth || isMobile || isRegion) {
      setIsError({
        ...isError,
        isAxios: true,
        axiosMsg: '입력한 정보를 확인하세요'
      })
    } else if(email === '' || password === '' || name === '' || gender === '' || birth === '' || mobile === '' || region === '') {
      setIsError({
        ...isError,
        isAxios: true,
        axiosMsg: '입력한 정보를 확인하세요'
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
          region
        }
      })
      .then((res) => {
        if(res.data.message === 'Already Signed Up') {
          setIsError({
            ...isError,
            isAxios: true,
            axiosMsg: '이미 가입된 이메일입니다'
          })
        } else {
          dispatch(modalChanger('signinModalBtn'))
        }
      })
      .catch((err) => console.log(err))
    }
  }

  const handleNextPage = () => {
    if(pageIdx < 4) {
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

  return(
    <ModalContainer>
      <ModalBackdrop>
        <ModalView>
          <CloseBtn><div className='closeModalBtn' onClick={(e) => closeModal(e)}><FontAwesomeIcon icon={faTimes} /></div></CloseBtn>
          <header>
            <div>Sign Up</div>
          </header>
          {(() => {
            if(pageIdx === 0) {
              return (
                <UserImage>
                  <div className='label'>사진을 선택해 주세요</div>
                  <div className='imageSelect'>
                    <div className='circle'>
                      {isLoading ? <Loading /> : 
                      <img className='pic' src='img/bubble.png' />}
                      {/* 초기 src 값은 로고 온걸로 변환해주세요 */}
                      {/* 로딩이 끝나면 scr 주소를 변경해야 합니다 */}
                    </div>
                    <Camera>
                      <FontAwesomeIcon icon={faCamera} className='faCamera' onClick={(e) => handleRefClick(e)}/>
                      <input ref={cameraRef} className='imgUpload' id='file' type='file' accept={`image/${'*'}`} name='imgUpload' onChange={handleImgLoad}></input>
                    </Camera>
                  </div>
                </UserImage>
              )
            }
            else if(pageIdx === 1) {
              return (
                <UserID>
                  <tr>
                    <td className='label'>이메일</td>
                    <td className='input'>
                      <input 
                        type='email'
                        name='email'
                        value={userInfo.email}
                        onChange={(e) => handleInputChange(e)}/>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <div className='error'>{isError.emailMsg}</div>
                    </td>
                  </tr><tr>
                    <td className='label'>비밀번호</td>
                    <td className='input'>
                      <input
                        type='password'
                        name='password'
                        value={userInfo.password}
                        onChange={(e) => handleInputChange(e)}/>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <div className='error'>{isError.passwordMsg}</div>
                    </td>
                  </tr><tr>
                    <td className='label'>비밀번호<br />확인</td>
                    <td className='input'>
                      <input
                        type='password'
                        name='confirmPassword'
                        value={userInfo.confirmPassword}
                        onChange={(e) => handleInputChange(e)}/>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <div className='error'>{isError.confirmPasswordMsg}</div>
                    </td>
                  </tr>
                </UserID>
              )
            }
            else if(pageIdx === 2) {
              return (
                <UserInfo>
                <tr>
                  <td className='label'>닉네임</td>
                  <td className='input'>
                    <input
                      type='text'
                      name='name'
                      value={userInfo.name}
                      onChange={(e) => handleInputChange(e)}/>
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
                  <td className='error'>{isError.genderMsg}</td>
                </tr>
                <tr>
                  <td className='label'>생일</td>
                  <td className='input'>
                    <input
                      type='date'
                      name='birth'
                      max={date}
                      value={userInfo.birth}
                      onChange={(e) => handleInputChange(e)}
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td />
                  <td className='error'>{isError.birthMsg}</td>
                </tr>
                <tr>
                  <td className='label'>휴대폰</td>
                  <td className='input'>
                    <input
                      type='tel'
                      name='mobile'
                      value={userInfo.mobile}
                      onChange={(e) => handleInputChange(e)}
                      placeholder="'-'을 포함하여 입력하세요"
                    />
                  </td>
                </tr>
                <tr>
                  <td />
                  <td>
                    <div className='error'>{isError.mobileMsg}</div>
                  </td>
                </tr>
              </UserInfo>
              )
            }
            else if(pageIdx === 3) {
              return (
                <UserRegion>
                  <div id='map'>카카오맵 넣어조</div>
                  <div>지도 찍으면 input에 상세주소, input 작성하면 지도 이동됨</div>
                  <input />
                </UserRegion>
              )
            }
            else if(pageIdx === 4) {
              return (
                <UserCheck>
                  <div className='header'>이 정보가 맞나요?</div>
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
                      <td className='label'>휴대폰</td>
                      <td className='info'>{userInfo.mobile}</td>
                    </tr>
                  </table>
                  <div className='error'>{isError.axiosMsg}</div>
                </UserCheck>
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
            else if(pageIdx === 4) {
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