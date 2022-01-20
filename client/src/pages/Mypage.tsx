import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AWS, { Detective } from 'aws-sdk';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faTrophy } from '@fortawesome/free-solid-svg-icons';

import { RootReducerType } from '../store/store';
import { AppState } from '../reducers';
import Loading from '../components/Loading';
import UserCancelModal from '../components/UserCancelModal'
import PartySlide from '../components/PartySlide';
import VerificationModal from '../components/VerificationModal';

// [dev] 더미데이터: 서버 통신되면 삭제
import dummyList from '../static/dummyList';
import { SIGNIN_FAIL } from '../actions/signinType';

export const MypageContainer = styled.div`
  width: 100%;
  padding: 60px 0;

  .imgChange {
    width: 40%;
    margin: 0 30%;
    .imgChangeBtn {
      width: 100%;
      height: 30px;
      border: none;
      border-radius: 20px;
      background-color: darkcyan;
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
    align-items: center;
  }

  button {
    width: 120px;
    height: 40px;

    border: none;
    border-radius: 30px;
    color: #fff;
    background-color: #50C9C3;

    margin: 10px 10px 0 0;
    cursor: pointer;
  }

  .btns {
    width: 100%;
    display: flex;
  }

  .error {
    font-size: 12px;
    color: red;
    padding-left: 12px;
  }
`
export const InfoTable = styled.table`
  width: 100%;
  padding: 5%;

  .label {
    width: 70px;
    height: 33px;
    font-size: 15px;
    font-family: 'DungGeunMo'; 
    text-align: center;
  }
  input {
    width: 170px;
    height: 33px;
    background-color: white;
    outline: none;
    border: none;
    border-bottom: 1px solid #d5d5d5;
    margin: 10px;
    padding: 0 2px;

    font-size: 13px;
    text-align: center;
  }
  select {
    width: 170px;
    height: 33px;
    background-color: white;
    outline: none;
    border: none;
    border-bottom: 1px solid #d5d5d5;
    margin: 10px;
    padding: 0 2px;

    font-size: 13px;
    text-align: center;
  }

  @media screen and (min-width: 500px) {
    width: 600px;
    margin-left: 12vw;

    select {
      width: 300px;
    }
    input {
      width: 300px;
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
  // [dev] 더미데이터: 서버 통신되면 삭제
  const { userInfo, myParty, localParty } = dummyList;
  //isLoading과 isInfoLoading, isChange는 최종단계에서 true, true, false가 기본값 입니다.
  const [curTab, setCurTab] = useState(0);
  const [parties, setParties] = useState(myParty);
  const [isLoading, setIsLoading] = useState(false);
  const [isInfoLoading, setIsInfoLoading] = useState(false);
  //img 상태가 제대로 반영이 안되면 로딩창 넣어주세요
  const [imgLoading, setImgLoading] = useState(false);
  const [isChange, setIsChange] = useState(true);
  const [callModal, setCallModal] = useState(false);
  const [from, setFrom] = useState('');
  const [basicInfo, setBasicInfo] = useState({
    userName: '베이직이름',
    profileImage: '/img/defaultThumbnail.png',
    address: '수원시 장안구',
    level: 7,
    exp: 148
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
  const [wrongConfirm, setWrongConfirm] = useState({
    err: false,
    msg: '비밀번호를 다시 확인해주세요'
  });
  const [wrongMobile, setWrongMobile] =useState({
    err: false,
    msg: "'-'를 포함하여 입력하세요"
  });

  const signinReducer = useSelector((state: RootReducerType) => state.signinReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef<any>();
  const imgRef=useRef<any>(null);

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
        Key: `${signinReducer.userInfo.id}_profileImage`,
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
      const res = await axios.get(`${process.env.REACT_APP_CLIENT_URL}/user/profile/${signinReducer.userInfo?.id}`)
      const userInfo = res.data.userInfo
      setChangeInfo({
        ...changeInfo,
        userName: userInfo.userName,
        birth: userInfo.birth,
        address: userInfo.address,
        gender: userInfo.gender,
        mobile: userInfo.mobile
      })
      setIsInfoLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = {
      mobile: /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/
    };

    setChangeInfo({
      ...changeInfo,
      [e.target.name]: e.target.value
    })

    if(e.target.name === 'confirm') {
      if(e.target.value === changeInfo.password) {
        setWrongConfirm({
          ...wrongConfirm,
          err: false
        })
      }
    }
    else if(e.target.name === 'mobile') {
      if(!regex.mobile.test(e.target.value)) {
        setWrongMobile({
          ...wrongMobile,
          err: true
        })
      } else {
        setWrongMobile({
          ...wrongMobile,
          err: false
        })
      }
    }
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

  const submitInfo = async () => {
    const { userName, profileImage, password, confirm, birth, gender, address, mobile, nowPwd } = changeInfo
    if(password !== confirm) {
      setWrongConfirm({
        ...wrongConfirm,
        err: true
      })
      return;
    }

    const verify = await axios.post('https://localhost:443/user/verification', {
      userInfo: {
        id: signinReducer.userInfo?.id,
        password: nowPwd
        //API확인해주세요 (email제외)
      }
    })
    if(verify.data.message === "User Identified") {
      if(password === '') {
        const res = await axios.patch('https://localhost:443/user/profile', {
          userInfo: {
            profileImage,
            userName,
            password: nowPwd,
            birth,
            gender,
            address,
            mobile
          }
        })
        if(res.data.message === "Successfully Modified") {
          setIsChange(false)
        }
      } 
      else if (password !== '') {
        const res = await axios.patch('https://localhost:443/user/profile', {
          userInfo: {
            profileImage: profileImage,
            userName: userName,
            password: password,
            birth: birth,
            gender: gender,
            address: address,
            mobile: mobile
          }
        })
        if(res.data.message === "Successfully Modified") {
          setIsChange(false)
        }
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
  const handleSignOut = async () => {
    const cookie = document.cookie.split("; ");
    const accessToken = cookie[0].slice(0, 5) === "token" ? cookie[0].replace("token=", "") : cookie[1].replace("token=", "");
    const signupType = cookie[1].slice(0, 10) === "signupType" ? cookie[1].replace("signupType=", "") : cookie[0].replace("signupType=", "");
    await axios.post("https://localhost:443/signout", {
      access_token: accessToken, 
      signup_type: signupType
    });
    dispatch({ type: SIGNIN_FAIL });
    document.cookie = `token=; expires=${new Date()}; domain=localhost; path=/;`;
    document.cookie = `signupType=; expires=${new Date()}; domain=localhost; path=/;`;
    navigate("/");
  };
  const handleWithdrawal = async () => {
    const cookie = document.cookie.split("; ");
    const accessToken = cookie[0].slice(0, 5) === "token" ? cookie[0].replace("token=", "") : cookie[1].replace("token=", "");
    const signupType = cookie[1].slice(0, 10) === "signupType" ? cookie[1].replace("signupType=", "") : cookie[0].replace("signupType=", "");
    const userId = signinReducer.userInfo?.id;
    await axios.delete(`https://localhost:443/user/${userId}/${signupType}`, {
      headers: {
        access_token: accessToken
      }
    });
    document.cookie = `token=; expires=${new Date()}; domain=localhost; path=/;`;
    document.cookie = `signupType=; expires=${new Date()}; domain=localhost; path=/;`;
    dispatch({ type: SIGNIN_FAIL });
    navigate("http://localhost:3000");
  };
  const userCancelHandler = (e: React.MouseEvent<HTMLButtonElement>, from: string) => {
    setFrom(from);
    setCallModal(!callModal);
  };

  //페이지 진입시 로딩
  useEffect(() => {
    setIsLoading(true)
    const fetchBasicInfo = async () => {
      const cookie = document.cookie.split("; ");
      const accessToken = cookie[0].replace("token=", "").slice(1);
      const signupType = cookie[1].replace("signupType=", "");
      const res = await axios.get(`https://localhost:443/user/${signinReducer.userInfo?.id}`, {
        withCredentials: true,
      });
      const userInfo = res.data.userInfo;
      setBasicInfo({
        userName: userInfo.userName,
        profileImage: userInfo.profileImage,
        address: userInfo.address,
        level: userInfo.level,
        exp: userInfo.exp
      })
    }
    fetchBasicInfo();
    fetchJoinParty();
    setIsLoading(false);
  },[])
  
  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLoggedIn
  );
  if(!isLoggedIn){
    return <Navigate to="/" />
  }

  if(isLoading) {
    return <Loading />
  }

  return (
    <MypageContainer>
      {callModal? <UserCancelModal from={from} userCancelHandler={userCancelHandler} handleSignOut={handleSignOut} handleWithdrawal={handleWithdrawal} /> : null}
      <MypageHeader>
        <div className="leftWrapper">
          <div className='profileImageContainer'>
            <img
              src={basicInfo.profileImage}
              alt='thumbnail'
              onError={() => {
                return(imgRef.current.src = '/img/bubble.png')
              }}
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
      <div className='imgChange'>
        {isChange ? 
        <div>
          <button 
            className='imgChangeBtn'
            onClick={(e) => handleRefClick(e)
          }>
          이미지 수정
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
      </div>
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
                      <td>
                        <input
                          name='userName'
                          value={changeInfo.userName}
                          onChange={(e) => handleInputChange(e)}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td className='label'>비밀번호</td>
                      <td>
                        <input
                          placeholder='비밀번호 수정시에만 입력하세요'
                          name='password'
                          type='password'
                          value={changeInfo.password}
                          onChange={(e) => handleInputChange(e)}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td className='label'>비밀번호<br />확인</td>
                      <td>
                        <input
                          placeholder='비밀번호 수정시에만 입력하세요'
                          name='confirm'
                          type='password'
                          value={changeInfo.confirm}
                          onChange={(e) => handleInputChange(e)}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td />
                      {wrongConfirm.err ? 
                      <td className='error'>{wrongConfirm.msg}</td> : <td />}
                    </tr>
                    <tr>
                      <td className='label'>생일</td>
                      <td>
                        <input
                          type='date'
                          max={getCurrentDate()}
                          name='birth'
                          value={changeInfo.birth}
                          onChange={(e) => handleInputChange(e)}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td className='label'>젠더</td>
                      <td>
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
                      <td>
                        <input
                          name='address'
                          value={changeInfo.address}
                          onChange={(e) => handleInputChange(e)}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td className='label'>휴대폰</td>
                      <td>
                        <input
                          name='mobile'
                          value={changeInfo.mobile}
                          onChange={(e) => handleInputChange(e)}
                          placeholder="'-'을 포함해 입력하세요"
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td />
                      {wrongMobile.err ?
                      <td className='error'>{wrongMobile.msg}</td> : <td />}
                    </tr>
                    <tr>
                      <td className='label'>현재<br />비밀번호</td>
                      <td>
                        <input
                          name='nowPwd'
                          value={changeInfo.nowPwd}
                          onChange={(e) => handleInputChange(e)}
                          placeholder='비밀번호를 입력한뒤 제출하세요'
                        ></input>
                      </td>
                    </tr>
                  </InfoTable>
                  <button onClick={submitInfo}>제출</button><br />
                  <button onClick={handleIsChange}>취소</button>
                  <button onClick={(e) => userCancelHandler(e, "delete")}>회원 탈퇴</button>
                </div>
              )
            }
          } else {
            return(
              <div className='btns'>
                <button onClick={handleIsChange}>
                  개인 정보 수정
                </button>
                <button onClick={(e) => userCancelHandler(e, "signout")}>
                  로그아웃
                </button>
              </div>
            )}
        })()}
      </MypageInfo>
      <MypartyCards>
        <div className='subject'>내 파티</div>
        <fieldset className='cardTabContainer'>
          <ol className='cardTab'>
            <li value={0} className={`tab ${curTab === 0 ? ' focus' : ''}`} onClick={(e) => handleLiClick(e)}>참여중 파티</li>
            <li> | </li>
            <li value={1} className={`tab ${curTab === 1 ? ' focus' : ''}`} onClick={(e) => handleLiClick(e)}>모집중 파티</li>
            <li> | </li>
            <li value={2} className={`tab ${curTab === 2 ? ' focus' : ''}`} onClick={(e) => handleLiClick(e)}>완료 파티</li>
          </ol>
        </fieldset>
          {(() => {
            if(curTab === 0) {
              return <PartySlide myParty={parties} />
            }
            else if(curTab === 1) {
              return <PartySlide myParty={parties} />
            }
            else if(curTab === 2) {
              return <PartySlide myParty={parties} />
            }
          })()}
      </MypartyCards>
    </MypageContainer>
  );
}
