import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCrown } from '@fortawesome/free-solid-svg-icons';

import { RootReducerType } from '../store/store';
import { AppState } from '../reducers';
import Loading from '../components/Loading';
import { SIGNIN_FAIL } from '../actions/signinType';

export const MypageContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1280px;

  .subject {
    font-size: 22px;
    font-family: 'DungGeunMo';
  }

  margin: 60px auto;
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
    border: 1px solid black;
    border-radius: 100%;
  }

  .mainProfile {
    margin: 0 3vw;
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

  .changeInfoBtn {
    width: 160px;
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
`

export const MypartyCards = styled.div`
  width: 100%;
  min-height: 300px;
  padding: 3vh 13vw;
  
  fieldset {
    border: none;
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true)
  const [isInfoLoading, setIsInfoLoading] = useState(true)
  const [basicInfo, setBasicInfo] = useState({
    userName: '',
    profileImage: '',
    region: '',
    level: ''
  })
  const [changeInfo, setChangeInfo] = useState({
    name: '',
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
  const [curTab, setCurTab] = useState(0)

  let today: any = new Date();
  const signinReducer = useSelector((state: RootReducerType) => state.signinReducer);

  //전환시 기본 정보 입력하게 하기 위해선 다중연산 필요(로딩창 구현)
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
      setIsChange(true)
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeInfo({
      ...changeInfo,
      [e.target.name]: e.target.value
    })
  }
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChangeInfo({
      ...changeInfo,
      [e.target.name]: e.target.value
    })
  }
  const handleLiClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setCurTab(e.currentTarget.value)
  }

  const submitInfo = async () => {
    const { name, password, confirm, birth, gender, region, mobile, nowPwd } = changeInfo

    const verify = await axios.post('https://localhost:443/user/verification', {
      userInfo: {
        id: signinReducer.userInfo?.id,
        password: nowPwd
        //API확인해주세요 (email제외)
      }
    })
    if(verify.data.message === "User Identified") {
      const res = await axios.patch('https://localhost:443/user/profile', {
        userInfo: {
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

  const handleSignOut = async () => {
    const cookie = document.cookie.split("; ");
    const accessToken = cookie[0].replace("token=", "");
    const signupType = cookie[1].replace("signupType=", "");
    await axios.post("https://localhost:443/signout", {
      accessToken, signupType
    });
    dispatch({
      type: SIGNIN_FAIL
    });
    document.cookie = `token=; expires=${new Date()}; domain=localhost; path=/;`;
    document.cookie = `signupType=; expires=${new Date()}; domain=localhost; path=/;`;
    navigate("/");
  };

  const handleWithdrawal = async () => {
    const cookie = document.cookie.split("; ");
    const accessToken = cookie[0].replace("token=", "");
    const signupType = cookie[1].replace("signupType=", "");
    const userId = signinReducer.userInfo?.id;
    await axios.delete(`https://localhost:443/user/${userId}/${signupType}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    document.cookie = "token=;";
    document.cookie = "signupType=;";
    navigate("http://localhost:3000");
  };

  //페이지 진입시 로딩
  useEffect(() => {
    const fetchBasicInfo = async () => {
      const cookie = document.cookie.split("; ");
      const accessToken = cookie[0].replace("token=", "").slice(1);
      const signupType = cookie[1].replace("signupType=", "");
      const res = await axios.get(`https://localhost:443/user/${signinReducer.userInfo?.id}`, {
        withCredentials: true
      });
      const userInfo = res.data.userInfo;
      setBasicInfo({
        userName: userInfo.userName,
        profileImage: userInfo.profileImage,
        region: userInfo.region,
        level: userInfo.region
      })
    }
    fetchBasicInfo()
    setIsLoading(false)
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
      <MypageHeader>
        <div className='profileImage'></div>
        {/* 이미지 연결이 되면 주석 풀어준 뒤 border는 없애주세요
        <img className='profileImage' src={basicInfo.profileImage} /> */}
        <p className='mainProfile'>
          <div className='userName'>{basicInfo.userName}</div>
          <div>
            <FontAwesomeIcon icon={faMapMarkerAlt} className='mapMarker'/><span className='text'>지역정보를 받아옵니다{basicInfo.region}</span>
          </div>
          <div>
            <FontAwesomeIcon icon={faCrown} className='crown'/><span className='text'>레벨정보를 받아옵니다{basicInfo.level}</span>
          </div>
        </p>
      </MypageHeader>
      <MypageInfo>
        <div className='subject'>프로필</div>
        {/* ---------------여기부터-------------- */}
        {/* {(() => {
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
                          placeholder='비밀번호 수정시에만 입력해주세요'
                          name='password'
                          value={changeInfo.password}
                          onChange={(e) => handleInputChange(e)}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td className='label'>비밀번호<br />확인</td>
                      <td>
                        <input
                          placeholder='비밀번호 수정시에만 입력해주세요'
                          name='confirm'
                          value={changeInfo.confirm}
                          onChange={(e) => handleInputChange(e)}
                        ></input>
                      </td>
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
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td className='label'>현재<br />비밀번호</td>
                      <td>
                        <input
                          name='nowPwd'
                          value={changeInfo.nowPwd}
                          onChange={(e) => handleInputChange(e)}
                          placeholder='비밀번호를 입력한뒤 제출해주세요'
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
            <button
              className='changeInfoBtn'
              onClick={handleIsChange}
            >
              개인 정보 수정
            </button>
          }
        })()} */}
        {/* ---------------여기까지-------------- */}
        {isChange ?
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
                  placeholder='비밀번호 수정시에만 입력해주세요'
                  name='password'
                  value={changeInfo.password}
                  onChange={(e) => handleInputChange(e)}
                ></input>
              </td>
            </tr>
            <tr>
              <td className='label'>비밀번호<br />확인</td>
              <td>
                <input
                  placeholder='비밀번호 수정시에만 입력해주세요'
                  name='confirm'
                  value={changeInfo.confirm}
                  onChange={(e) => handleInputChange(e)}
                ></input>
              </td>
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
                ></input>
              </td>
            </tr>
            <tr>
              <td className='label'>현재<br />비밀번호</td>
              <td>
                <input
                  name='nowPwd'
                  value={changeInfo.nowPwd}
                  onChange={(e) => handleInputChange(e)}
                  placeholder='비밀번호를 입력한뒤 제출해주세요'
                ></input>
              </td>
            </tr>
          </InfoTable>
          <button className='submitInfoBtn' onClick={submitInfo}>제출</button><br />
          <button className='cancelInfoBtn' onClick={handleIsChange}>취소</button>
        </div>
        :
        <button
          className='changeInfoBtn'
          onClick={handleIsChange}
        >
          개인 정보 수정
        </button>
        }
        <button onClick={handleSignOut}>로그아웃</button>
        <button onClick={handleWithdrawal}>회원탈퇴</button>
      </MypageInfo>
      <MypartyCards>
        <div className='subject'>내 파티</div>
        <fieldset className='cardTabContainer'>
          <ol className='cardTab'>
            <li value={0} className={`join${curTab === 0 ? ' focus' : ''}`} onClick={(e) => handleLiClick(e)}>참여중 파티</li>
            <li className='disabled'> | </li>
            <li value={1} className={`recruite${curTab === 1 ? ' focus' : ''}`} onClick={(e) => handleLiClick(e)}>모집중 파티</li>
            <li className='disabled'> | </li>
            <li value={2} className={`favorite${curTab === 2 ? ' focus' : ''}`} onClick={(e) => handleLiClick(e)}>관심 파티</li>
            <li className='disabled'> | </li>
            <li value={3} className={`complete${curTab === 3 ? ' focus' : ''}`} onClick={(e) => handleLiClick(e)}>완료 파티</li>
          </ol>
        </fieldset>
        {/* 파티 카드 컴포넌트가 완료될 경우 작성 */}
        <fieldset>
          {(() => {
            if(curTab === 0) {
              return (<div>참여 파티 카드</div>)
            }
            else if(curTab === 1) {
              return (<div> 모집 파티 카드</div>)
            }
            else if(curTab === 2) {
              return (<div> 관심 파티 카드</div>)
            }
            else if(curTab === 3) {
              return (<div> 완료 파티 카드</div>)
            }
          })()}
        </fieldset>
        <button onClick={handleSignOut}>
          로그아웃
        </button>
      </MypartyCards>
    </MypageContainer>
  );
}
