import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AWS from 'aws-sdk';
import { cookieParser, requestKeepLoggedIn } from "../App";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SIGNIN_SUCCESS } from '../actions/signinType';
import { faMapMarkerAlt, faTrophy } from '@fortawesome/free-solid-svg-icons';

import { RootReducerType } from '../store/store';
import { AppState } from '../reducers';
import Loading from '../components/Loading';
import UserCancelModal from '../components/UserCancelModal'
import PartySlide from '../components/PartySlide';
import VerificationModal from '../components/VerificationModal';
import UserMap from '../components/UserMap';
import EmptyParty from '../components/EmptyParty';

// [dev] 더미데이터: 서버 통신되면 삭제
import dummyList from '../static/dummyList';
import { SIGNIN_FAIL } from '../actions/signinType';

export const MypageContainer = styled.div`
  width: 100%;
  padding: 60px 0;

  .imgChange {
    width: 90%;

    display: flex;
    justify-content: flex-end;

    .imgChangeBtn {
      margin-top: 0;
      width: 150px;
      height: 40px;

      border: 1px solid #50C9C3;
      border-radius: 30px;
      color: #50C9C3;
      background-color: #fff;

      padding: 0 10px;

      cursor: pointer;
    }
  }

  .subject {
    font-size: 1.2rem;
    font-weight: bold;

    margin-bottom: 10px;
  }

  section {
    margin: 30px 0;
    padding: 0 10%;
  }

  .error {
    text-align: center;
    font-size: 0.7rem;
    color: #f34508;
  }
`

export const MypageHeader = styled.header`
  width: 100%;
  display: flex;

  margin: 30px 0;
  padding: 0 10%;

  .leftWrapper {
    width: 40%;
    height: 100%;

    display: flex;
    justify-content: flex-end;

    .profileImageContainer {

      width: 100px;
      height: 100px;

      border-radius: 100%;
      overflow: hidden;

      border: 1px solid #d5d5d5;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .mainProfile {
    margin: 0 30px;
    margin-top: 5px;

    width: 60%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;

    .userName {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .icon {
      margin-right: 8px;
    }

    .info {
      color: #777;
      margin-bottom: 5px;
    }

  }
`

export const MypageInfo = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;

  .changeInfo {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* align-items: center; */
  }

  button {
    width: 120px;
    height: 40px;

    border: none;
    border-radius: 30px;
    color: #fff;
    background-color: #50C9C3;

    margin: 10px 20px 0 0;
    cursor: pointer;
  }

  .btns {
    width: 100%;
    display: flex;
  }

  .buttons {
    width: 100%;
    padding: 0 5%;
    margin: 20px 0;

    display: flex;
    justify-content: center;

    .cancel {
      border: 1px solid #50C9C3;
      color: #50C9C3;
      background-color: #fff;
    }
  }

  @media screen and (max-width: 600px) {
    .buttons {
      display: flex;
      flex-direction: column;

      width: 100%;

      margin: 10px 0;

      button {
        width: 100%;
      }
    }
  }
`
export const InfoTable = styled.table`
  margin: 10px 0 20px 0;

  td {
    height: 50px;
  }

  .label {
    padding-right: 15px;
    text-align: center;

    font-weight: bold;
  }

  .input {
    padding: 0 8px;
    max-width: 400px;

    input {
      border: none;
      border-bottom: 1px solid #d5d5d5;

      width: 100%;
      height: 25px;

      text-align: center; 
    }

    input[type=date] {
      font-family: "-apple-system";
    }

    select {
      width: 100%;
      text-align: center;

      border: none;
      border-bottom: 1px solid #d5d5d5;
    }
  }

  .error {
    margin-top: 5px;
  }
  
  .map {
    display: none;
  }

  @media screen and (max-width: 600px) {
    .input {
      max-width: 200px;
    }
  }
`

export const ProgressBar = styled.div`
  margin-top: 5px;

 .barContainer {
    height: 10px;
    width: 100%;
    max-width: 200px;
    /* border: 1px solid #e9e7e7; */
    border-radius: 50px;
    background-color: #e9e7e7;
  }

  .barFiller {
    height: 100%;
    background-color: #50C9C3;
    border-radius: inherit;
    text-align: right;
  }


`

export const MypartyCards = styled.section`
  width: 100%;
  
  fieldset {
    border: none;
    margin-bottom: 10px;
  }
  
  .cardTab {
    list-style: none;

    li {
      float: left;
      margin: 5px 3px;
    }

    .tab {
      cursor: pointer;
      color: #d5d5d5;
      
      &.focus {
        color: black;
        font-weight: bold;
      }
    }
  }
`

export default function Mypage () {
  const signinReducer = useSelector((state: RootReducerType) => state.signinReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef<any>();
  const imgRef=useRef<any>(null);

  const { signupType } = cookieParser();
  
  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLoggedIn
  );

  const userInfoFromStore = useSelector(
    (state: AppState) => state.signinReducer.userInfo
  );

  //isLoading과 isInfoLoading, isChange는 최종단계에서 true, true, false가 기본값 입니다.
  const [curTab, setCurTab] = useState(0);
  const [parties, setParties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInfoLoading, setIsInfoLoading] = useState(true);
  //img 상태가 제대로 반영이 안되면 로딩창 넣어주세요
  const [imgLoading, setImgLoading] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [callModal, setCallModal] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [from, setFrom] = useState('');
  const [fixedLocation, setFixedLocation] = useState('');
  const [formatAddress, setFormatAddress] = useState('');
  const [basicInfo, setBasicInfo] = useState({
    userName: signinReducer.userInfo.userName,
    profileImage: signinReducer.userInfo.profileImage,
    address: signinReducer.userInfo.address.split(" ")[0] + " " + signinReducer.userInfo.address.split(" ")[1],
    level: 0,
    exp: 0
  });
  const [changeInfo, setChangeInfo] = useState({
    userName: '',
    profileImage: '',
    password: '',
    confirm: '',
    birth: '',
    gender: '',
    address: '',
    mobile: '',
    nowPwd: ''
  });

  const [isError, setIsError] = useState({
    isName: true,
    isMobile: true,
    isAxios: true,
    nameMsg: '',
    mobileMsg: '',
    axiosMsg: '',
  });

  const [isPassword, setIsPassword] = useState({
    isValid: false,
    passwordMsg: '',
  })

  const [isConfirmPassword, setIsConfirmPassword] = useState({
    isValid: false,
    confirmPasswordMsg: '',
  })

  // [CAUTION] 이미지 서버 관련 코드 => 범님 외 수정 X
  AWS.config.update({
    region: "ap-northeast-2",
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "ap-northeast-2:d4282d0a-72a9-4d98-a6b6-335f48bbf863"
    })
  })
  const handleRefClick = (e: any) => {
    e.preventDefault();
    fileRef.current.click();
  }
  const handleImgLoad = async (e: any) => {
    setImgLoading(true)
    let file = e.target.files[0]

    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: "teo-img",
        Key: `${signinReducer.userInfo.id}_profileImage.jpg`,
        Body: file,
      }
    })
    const promise = upload.promise()

    promise.then(
      function (data: any) {
        console.log("이미지 업로드에 성공했습니다 👉🏻 URL: ",data.Location)
        setChangeInfo({
          ...changeInfo,
          profileImage: data.Location
        })
        setBasicInfo({
          ...basicInfo,
          profileImage: data.Location
        })
        setImgLoading(false)
      },
      function (err: any) {
        return console.log('오류가 발생했습니다: ', err.message)
      }
    )
  }

  const handleIsChange = async () => {
    if(isChange) {
      setIsChange(false)
    } else {
      setIsInfoLoading(true)
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile/${signinReducer.userInfo?.id}`)
      const userInfo = res.data.userInfo
      setChangeInfo({
        ...changeInfo,
        userName: userInfo.userName,
        birth: userInfo.birth,
        address: userInfo.address,
        gender: userInfo.gender,
        mobile: userInfo.mobile
      });
      setIsInfoLoading(false);
      setIsChange(true);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;

    setChangeInfo({
      ...changeInfo,
      [name]: value,
    })

    const regex={
      password: /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W).{8,16}$)/,
      mobile: /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/
    };

    if(name === 'userName'){
      if(value.length < 2){
        setIsError({
          ...isError,
          isName: false,
          nameMsg: "두 글자 이상 입력해주세요."
        })
      }
    }

    if(name === 'password'){
      if(!regex.password.test(value)){
        setIsPassword({
          isValid: false,
          passwordMsg: '숫자/영문자/특수문자를 포함한 8~16자리의 비밀번호여야 합니다.'
        })
      } else {
        setIsPassword({
          isValid: true,
          passwordMsg: '',
        })
      }

      if(changeInfo.confirm !== value){
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
      if(changeInfo.password !== value){
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
    setChangeInfo({
      ...changeInfo,
      [e.target.name]: e.target.value
    })
  }

  function getCurrentDate() {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    return `${year}-${month<10?`0${month}`:`${month}`}-${date}`
  }

  const submitInfo = async () => {
    const { userName, profileImage, password, confirm, birth, gender, address, mobile, nowPwd } = changeInfo;
    const { isName, isMobile } = isError;
    if(password !== confirm || !isName || !isMobile) {
      setIsError({
        ...isError,
        isAxios: false,
        axiosMsg: '입력하신 정보를 확인해주세요.',
      })
    }
    else if(password === '') {      
      setIsError({
        isName: true,
        isMobile: true,
        isAxios: true,
        nameMsg: '',
        mobileMsg: '',
        axiosMsg: '',
      })
      const res = await axios.patch(`${process.env.REACT_APP_API_URL}/user/profile`, {
        userInfo: {
          userId: signinReducer.userInfo?.id,
          profileImage,
          userName,
          password: nowPwd,
          birth,
          gender,
          address: formatAddress,
          mobile
        }
      })
      if(res.data.message === "Successfully Modified") {
        setIsChange(false)
      }
    } 
    else if (password !== '') {
      const res = await axios.patch(`${process.env.REACT_APP_API_URL}/user/profile`, {
        userInfo: {
          userId: signinReducer.userInfo?.id,
          profileImage,
          userName,
          password,
          birth,
          gender,
          address: formatAddress,
          mobile
        }
      })
      if(res.data.message === "Successfully Modified") {
        setIsChange(false)
      }
    }
  }

  //파티 데이터
  const fetchJoinParty = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/participating/${signinReducer.userInfo?.id}`)
    const myParty = res.data.myParty
    setParties(myParty)
  }
  const fetchRecruiteParty = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/recruiting/${signinReducer.userInfo?.id}`)
    const myParty = res.data.myParty
    setParties(myParty)
  }
  const fetchCompleteParty = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/completed/${signinReducer.userInfo?.id}`)
    const myParty = res.data.myParty
    setParties(myParty)
  }

  const handleLiClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if(e.currentTarget.value === 0) {
      fetchJoinParty()
    }
    else if(e.currentTarget.value === 1) {
      fetchRecruiteParty()
    }
    else if(e.currentTarget.value === 2) {
      fetchCompleteParty()
    }
    setCurTab(e.currentTarget.value)
  }

  const handleSignOut = async () => {
    const { token, signupType, location } = cookieParser();
    await axios.post(`${process.env.REACT_APP_API_URL}/signout`, {
      access_token: token, 
      signup_type: signupType
    });
    dispatch({ type: SIGNIN_FAIL });
    document.cookie = `token=; expires=${new Date()}; domain=localhost; path=/;`;
    document.cookie = `signupType=; expires=${new Date()}; domain=localhost; path=/;`;
    document.cookie = `location=; expires=${new Date()}; domain=localhost; path=/;`;
    document.cookie = `isLoggedIn=; expires=${new Date()}; domain=localhost; path=/;`;
    navigate("/");
  };
  const handleWithdrawal = async () => {
    const { token, signupType, location } = cookieParser();
    const userId = signinReducer.userInfo?.id;
    await axios.delete(`${process.env.REACT_APP_API_URL}/user/${userId}/${signupType}`, {
      headers: {
        access_token: token
      }
    });
    dispatch({ type: SIGNIN_FAIL });
    document.cookie = `token=; expires=${new Date()}; domain=localhost; path=/;`;
    document.cookie = `signupType=; expires=${new Date()}; domain=localhost; path=/;`;
    document.cookie = `location=; expires=${new Date()}; domain=localhost; path=/;`;
    document.cookie = `isLoggedIn=; expires=${new Date()}; domain=localhost; path=/;`;
    navigate("/");
  };
  const userCancelHandler = (e: React.MouseEvent<HTMLButtonElement>, from: string) => {
    setFrom(from);
    setCallModal(!callModal);
  };

  function verficationModalHandler(e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>){
    setIsVerificationModalOpen(!isVerificationModalOpen);
  }

  const handleFormatAddressChange = (address: string) => {
    setFormatAddress(address);
  }

  const handleSearchLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.code === 'Enter' || e.code === 'Space' || e.code === 'ArrowRight') {
      setFixedLocation(changeInfo.address);
    }
  }

  //페이지 진입시 로딩
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const { token, signupType, location } = cookieParser();
      await requestKeepLoggedIn(token, signupType).then((res) => {
        dispatch({
          type: SIGNIN_SUCCESS,
          payload: res.data.userInfo
        });
        document.cookie = `location=${process.env.REACT_APP_CLIENT_URL}/mypage`;
      });
    })();
  }, []);

  
  useEffect(() => {
    (async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userInfoFromStore.id}`, {
        withCredentials: true,
      });
      const userInfo = res.data.userInfo;
      setBasicInfo({
        userName: userInfo.userName,
        profileImage: userInfo.profileImage,
        address: userInfo.address,
        level: userInfo.level,
        exp: userInfo.exp
      });
    })();
    fetchJoinParty();
  }, [ userInfoFromStore ]);
  
  useEffect(() => {
    setIsLoading(false);
  }, [ basicInfo ]);

  if(!cookieParser().isLoggedIn){
    return <Navigate to="/" />
  }

  if(isLoading) {
    return <Loading />
  }

  return (
    <MypageContainer>
      {callModal? <UserCancelModal from={from} userCancelHandler={userCancelHandler} handleSignOut={handleSignOut} handleWithdrawal={handleWithdrawal} /> : null}
      {isVerificationModalOpen? <VerificationModal userId={signinReducer.userInfo?.id} handleIsChange={handleIsChange} verficationModalHandler={verficationModalHandler} /> : null}
      <MypageHeader>
        <div className="leftWrapper">
          <div className='profileImageContainer'>
            <img
              src={basicInfo.profileImage ? basicInfo.profileImage : 'https://teo-img.s3.ap-northeast-2.amazonaws.com/defaultProfile.png'}
              alt='thumbnail'
              // onError={() => {
              //   return(imgRef.current.src = 'img/bubble.png')
              // }}
            />
          </div>
        </div>
        <p className='mainProfile'>
          <div className='userName'>{basicInfo.userName}</div>
          <div className="info">
            <FontAwesomeIcon icon={faMapMarkerAlt} className='icon'/>{basicInfo.address.split(" ")[0] + " " + basicInfo.address.split(" ")[1]}
          </div>
          <div className="info">
            <FontAwesomeIcon icon={faTrophy} className='icon'/>Lv. {basicInfo.level}
          </div>
          <ProgressBar>
            <div className="barContainer">
              <div className="barFiller" style={{ width: `${Math.floor(basicInfo.exp % 20) * 5}%` }} />
            </div>
          </ProgressBar>
        </p>
      </MypageHeader>
      {isChange ? 
          <div className="imgChange">
            <button 
              className='imgChangeBtn'
              onClick={(e) => handleRefClick(e)
            }>
            프로필 이미지 수정
            </button>
            <input 
              ref={fileRef}
              type='file'
              className='imgInput'
              id='profileImg'
              accept='image/*'
              name='file'
              hidden={true}
              onChange={handleImgLoad}
            />
          </div>
        : null }
      <MypageInfo>
        <div className='subject'>프로필</div>
        {(() => {
          if(isChange) {
            if(isInfoLoading) {
              return (<Loading />)
            } else {
              return (
                <div className='changeInfo'>
                  <InfoTable>
                    <tr>
                      <td className='label'>닉네임</td>
                      <td className='input'>
                        <input
                          name='userName'
                          value={changeInfo.userName}
                          autoComplete='off'
                          onChange={(e) => handleInputChange(e)}
                        ></input>
                        <div className='error'>{isError.nameMsg}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className='label'>비밀번호</td>
                      <td className='input'>
                        <input
                          placeholder='비밀번호 수정시에만 입력하세요'
                          name='password'
                          type='password'
                          value={changeInfo.password}
                          onChange={(e) => handleInputChange(e)}
                        ></input>
                        <div className='error'>{isPassword.passwordMsg}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className='label'>비밀번호<br />확인</td>
                      <td className='input'>
                        <input
                          placeholder='비밀번호 수정시에만 입력하세요'
                          name='confirm'
                          type='password'
                          value={changeInfo.confirm}
                          onChange={(e) => handleInputChange(e)}
                        ></input>
                        <div className='error'>{isConfirmPassword.confirmPasswordMsg}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className='label'>생일</td>
                      <td className='input'>
                        <input
                          type='date'
                          max={getCurrentDate()}
                          name='birth'
                          value={changeInfo.birth}
                          autoComplete='off'
                          onChange={(e) => handleInputChange(e)}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td className='label'>젠더</td>
                      <td className='input'>
                        <select
                          name='gender'
                          value={changeInfo.gender}
                          onChange={(e) => handleSelectChange(e)}
                          id='gender'
                        >
                          <option value='남성'>남성</option>
                          <option value='여성'>여성</option>
                          <option value='기타'>기타</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td className='label'>주소</td>
                      <td className='input'>
                        <div className="map">
                          <UserMap
                            location={fixedLocation} 
                            image={basicInfo.profileImage} 
                            handleFormatAddressChange={handleFormatAddressChange}
                          />
                        </div>
                        <input
                          name='address'
                          value={changeInfo.address}
                          autoComplete='off'
                          onChange={(e) => handleInputChange(e)}
                          onKeyUp={(e) => handleSearchLocation(e)}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td className='label'>전화번호</td>
                      <td className='input'>
                        <input
                          name='mobile'
                          value={changeInfo.mobile}
                          autoComplete='off'
                          onChange={(e) => handleInputChange(e)}
                          placeholder="'-'을 포함해 입력하세요"
                        ></input>
                        <div className='error'>{isError.mobileMsg}</div>
                      </td>
                    </tr>
                  </InfoTable>
                  <div className='error'>{isError.axiosMsg}</div>
                  <div className="buttons">
                    <button onClick={submitInfo}>변경</button>
                    <button onClick={handleIsChange} className="cancel">취소</button>
                    <button onClick={(e) => userCancelHandler(e, "delete")} className="cancel">회원 탈퇴</button>
                  </div>
                </div>
              )
            }
          } else {
            return(
              <div className='btns'>
                <button onClick={signupType === 'general' ? verficationModalHandler : handleIsChange}>
                  개인 정보 수정
                </button>
                <button onClick={(e) => userCancelHandler(e, "signout")}>
                  로그아웃
                </button>
              </div>
            )}
        })()}
      </MypageInfo>
      {!isChange ?
        <MypartyCards>
          <div className='subject'>내 파티</div>
          <fieldset className='cardTabContainer'>
            <ol className='cardTab'>
              <li value={0} className={`tab ${curTab === 0 ? ' focus' : ''}`} onClick={(e) => handleLiClick(e)}>참여중 파티</li>
              <li> | </li>
              <li value={1} className={`tab ${curTab === 1 ? ' focus' : ''}`} onClick={(e) => handleLiClick(e)}>운영중 파티</li>
              <li> | </li>
              <li value={2} className={`tab ${curTab === 2 ? ' focus' : ''}`} onClick={(e) => handleLiClick(e)}>완료 파티</li>
            </ol>
          </fieldset>
            {(() => {
              if(parties.length > 0){
                return <PartySlide myParty={parties} />
              } else {
                return <EmptyParty />
              }
            })()}
        </MypartyCards>
      : null}
    </MypageContainer>
  );
}
