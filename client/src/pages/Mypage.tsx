import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCrown } from '@fortawesome/free-solid-svg-icons';

import { RootReducerType } from '../store/store';
import { AppState } from '../reducers';
import Loading from '../components/Loading';
import PartySlide from '../components/PartySlide';

// [dev] 더미데이터: 서버 통신되면 삭제
import dummyList from '../static/dummyList';

export const MypageContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1280px;
  padding: 60px 1px;

  .subject {
    font-size: 22px;
    font-family: 'DungGeunMo';
  }
`

export const MypageHeader = styled.div`
  width: 100%;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;

  .profileImage {
    width: 100px;
    height: 100px;
    border: 2px solid #cff4d2;
    border-radius: 100%;
  }

  .mainProfile {
    margin: 0 3vw;
    display: flex;
    flex-direction: column;
  }
  .userName {
    font-size: 30px;
    margin-bottom: 1vh;
  }
  .mapMarker{
    margin: 0 9px;
    color: darkcyan;
  }
  .crown{
    margin: 0 5px;
    color: darkcyan;
  }

  @media screen and (min-width: 500px) {
    justify-content: flex-start;
    padding: 1vh 22vw;
  }
`

export const MypageInfo = styled.div`
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  padding: 3vh 13vw;

  .changeInfo {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .btns {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .changeInfoBtn {
    width: 140px;
    height: 30px;
    margin: 25px 0;

    border: none;
    border-radius: 20px;
    color: #888;
    background-color: #cff4d2;
  }
  .signoutBtn {
    width: 140px;
    height: 30px;
    margin: 25px 0;

    border: none;
    border-radius: 20px;
    color: #888;
    background-color: #cff4d2;
  }
  .submitInfoBtn {
    width: 160px;
    height: 30px;
    margin: 2px 0 0 0;

    border: none;
    border-radius: 20px;
    color: #888;
    background-color: #cff4d2;
  }
  .cancelInfoBtn {
    width: 160px;
    height: 30px;
    margin: 2px 0 0 0;

    border: none;
    border-radius: 20px;
    color: #888;
    background-color: #cff4d2;
  }
  .error {
    font-size: 12px;
    color: red;
    padding-left: 12px;
  }

  @media screen and (min-width: 500px) {
    .changeInfoBtn {
      border-radius: 30px;
      width: 200px;
      height: 40px;
      font-size: 15px;
    }
    .signoutBtn {
      border-radius: 30px;
      width: 200px;
      height: 40px;
      font-size: 15px;
    }
  }
`

export const MypartyCards = styled.div`
  width: 100%;
  min-height: 300px;
  padding: 3vh 13vw;
  
  fieldset {
    border: none;
  }
  
  .partyCardContainer {
    border: 1px solid black;
    width: 100%;
    height: 100%;

    padding: 10px 15px;
    
    section {
      margin-bottom: 20px;
    }

    main {
      display: flex;
      justify-content: center;
    }
  }

  .cardTabContainer{
    width: 325px;
    margin: 1vh 0;
  }
  .cardTab {
    list-style: none;

    li {
      float: left;
      margin: 0 3px;
      color: #d5d5d5;
    }
    .disabled {
      color: black;
    }
    .focus {
      color: black;
    }
    .join {
      cursor: pointer;
    }
    .recruite {
      cursor: pointer;
    }
    .favorite {
      cursor: pointer;
    }
    .complete {
      cursor: pointer;
    }
  }
`

export const InfoTable = styled.table`
  width: 300px;
  margin: 30px 0 15px 0;

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

export default function Mypage () {
  // [dev] 더미데이터: 서버 통신되면 삭제
  const { userInfo, myParty, localParty } = dummyList;
  //isLoading과 isInfoLoading, isChange는 최종단계에서 true, true, false가 기본값 입니다.
  const [isLoading, setIsLoading] = useState(false)
  const [isInfoLoading, setIsInfoLoading] = useState(false)

  const [basicInfo, setBasicInfo] = useState({
    name: '기본이름',
    profileImage: '기본이미지',
    region: '기본지역',
    level: '넘버타입',
    exp: '넘버타입'
  })
  const [changeInfo, setChangeInfo] = useState({
    name: '',
    profileImage: '',
    password: '',
    confirm: '',
    birth: '',
    gender: '',
    region: '',
    mobile: '',
    //기본값을 axios로 받아온 값으로 설정할 것.
    nowPwd: ''
  })
  const [isChange, setIsChange] = useState(true)
  const [wrongConfirm, setWrongConfirm] = useState({
    err: false,
    msg: '비밀번호를 다시 확인해주세요'
  })
  const [wrongMobile, setWrongMobile] =useState({
    err: false,
    msg: "'-'를 포함하여 입력하세요"
  })

  const [curTab, setCurTab] = useState(0)
  const [parties, setParties] = useState([])

  let today: any = new Date();
  const signinReducer = useSelector((state: RootReducerType) => state.signinReducer)

  const handleIsChange = async () => {
    if(isChange) {
      setIsChange(false)
    } else {
      const res = await axios.get(`${process.env.REACT_APP_CLIENT_URL}/user/profile/${signinReducer.userInfo?.id}`)
      const userInfo = res.data.userInfo
      setChangeInfo({
        ...changeInfo,
        name: userInfo.userName,
        birth: userInfo.birth,
        region: userInfo.region,
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
    const { name, profileImage, password, confirm, birth, gender, region, mobile, nowPwd } = changeInfo
    if(password !== confirm) {
      setWrongConfirm({
        ...wrongConfirm,
        err: true
      })
      return;
    }

    const verify = await axios.post(`${process.env.REACT_APP_API_URL}/user/verification`, {
      userInfo: {
        id: signinReducer.userInfo?.id,
        password: nowPwd
        //API확인해주세요 (email제외)
      }
    })
    if(verify.data.message === "User Identified") {
      const res = await axios.patch('http://localhost3000/user/profile', {
        userInfo: {
          profileImage: profileImage,
          userName: name,
          password: password,
          birth: birth,
          gender: gender,
          region: region,
          mobile: mobile
        }
      })

      if(res.data.message === "Successfully Modified") {
        setIsChange(false)
      }
    }
  }

  //파티 데이터
  const fetchJoinParty = async () => {
    const res = await axios.get(`${process.env.REACT_APP_CLIENT_URL}/user/participating/${signinReducer.userInfo?.id}`)
    const myParty = res.data.myParty
    setParties(myParty)
  }
  const fetchRecruiteParty = async () => {
    const res = await axios.get(`${process.env.REACT_APP_CLIENT_URL}/user/recruiting/${signinReducer.userInfo?.id}`)
    const myParty = res.data.myParty
    setParties(myParty)
  }
  const fetchCompleteParty = async () => {
    const res = await axios.get(`${process.env.REACT_APP_CLIENT_URL}/user/completed/${signinReducer.userInfo?.id}`)
    const myParty = res.data.myParty
    setParties(myParty)
  }

  //페이지 진입시 로딩
  useEffect(() => {
    const fetchBasicInfo = async () => {
      console.log('기본정보를 가져옵니다.')
      const res = await axios.get(`${process.env.REACT_APP_CLIENT_URL}/user/${signinReducer.userInfo?.id}`)
      const userInfo = res.data.userInfo
      setBasicInfo({
        name: userInfo.userName,
        profileImage: userInfo.profileImage,
        region: userInfo.region,
        level: userInfo.region,
        exp: userInfo.exp
      })
    }
    fetchBasicInfo()
    fetchJoinParty()
    setIsLoading(false)
  },[])

  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLogin
  );
  if(!isLoggedIn){
    return <Navigate to="/" />
  }

  if(isLoading) {
    return <Loading />
  }

  return (
    <MypageContainer>
      <MypageHeader>
        <div className='profileImage'></div>
        {/* 이미지 연결이 되면 주석 풀어준 뒤 border는 없애주세요
        <img className='profileImage' src={basicInfo.profileImage} /> */}
        <p className='mainProfile'>
          <div className='userName'>{basicInfo.name}</div>
          <div>
            <FontAwesomeIcon icon={faMapMarkerAlt} className='mapMarker'/><span className='text'>{basicInfo.region}</span>
          </div>
          <div>
            <FontAwesomeIcon icon={faCrown} className='crown'/><span className='text'>Lv.{basicInfo.level}</span>
          </div>
        </p>
      </MypageHeader>
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
                          name='name'
                          value={changeInfo.name}
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
                          max={today}
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
                      <td className='label'>지역</td>
                      <td>
                        <input
                          name='region'
                          value={changeInfo.region}
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
                  <button className='submitInfoBtn' onClick={submitInfo}>제출</button><br />
                  <button className='cancelInfoBtn' onClick={handleIsChange}>취소</button>
                </div>
              )
            }
          } else {
            return(
              <section className='btns'>
                <button
                  className='changeInfoBtn'
                  onClick={handleIsChange}
                >
                  개인 정보 수정
                </button>
                {/* 로그아웃 구현한 함수 넣어주세요 */}
                <button
                  className='signoutBtn'
                >
                  로그아웃
                </button>
              </section>
            )}
        })()}
      </MypageInfo>
      <MypartyCards>
        <div className='subject'>내 파티</div>
        <fieldset className='cardTabContainer'>
          <ol className='cardTab'>
            <li value={0} className={`join${curTab === 0 ? ' focus' : ''}`} onClick={(e) => handleLiClick(e)}>참여중 파티</li>
            <li className='disabled'> | </li>
            <li value={1} className={`recruite${curTab === 1 ? ' focus' : ''}`} onClick={(e) => handleLiClick(e)}>모집중 파티</li>
            <li className='disabled'> | </li>
            <li value={2} className={`complete${curTab === 2 ? ' focus' : ''}`} onClick={(e) => handleLiClick(e)}>완료 파티</li>
          </ol>
        </fieldset>
        <fieldset className='partyCardContainer'>
          {(() => {
            if(curTab === 0) {
              return (<div>참여 파티 카드</div>)
              // return (
              //   <section>
              //     <main className='joinParty'>
              //       <PartySlide myParty={parties} />
              //     </main>
              //   </section>
              // )
            }
            else if(curTab === 1) {
              return (<div> 모집 파티 카드</div>)
            }
            else if(curTab === 2) {
              return (<div> 완료 파티 카드</div>)
            }
          })()}
        </fieldset>
      </MypartyCards>
    </MypageContainer>
  );
}
