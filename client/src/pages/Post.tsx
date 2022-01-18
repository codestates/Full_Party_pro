import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AppState } from '../reducers';

import axios from 'axios';
import PostMap from '../components/PostMap';
import PostCancelModal from '../components/PostCancelModal'
import { RootReducerType } from '../store/store'

export const PostContainer = styled.div`
  width: 100%;
  background-color: #d5d5d5;
  position: absolute;
  left: 0;

  z-index: 999;
`

export const PostCard = styled.div`
  width: 85%;
  min-height: 20vh;
  margin: 30px auto;
  margin-bottom: 80px;
  background-color: white;

  border: none;
  border-radius: 20px;
  padding-bottom: 2vh;

  font-family: 'DungGeunMo';

  .cardHeader {
    display: flex;
    background-color: #50C9C3;
    border-radius: 20px 20px 0 0;
    justify-content: space-between;

    > .bubbleMsg{
      display: flex;

      > .bubble {
          width: 20px;
          margin: 0.5vh;
          margin-left: 15px;
        }
      > .headerMsg {
          color: white;
          margin: auto 0;
          margin-left: 8px;
        }
    }
    > .closeBtn {
      border: none;
      background: none;
      margin-right: 15px;
    }
  }

  .partyImg {
    width: 300px;
    height: 170px;
    display: flex;

    justify-content: center;
    align-items: center;

    margin: 1vh auto;

    border: 1px solid silver;

    .img {
      width: 100%;
      height: 100%;
    }
  }

  fieldset {
    border: none;
    margin: 2vh;

    .regionTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .regionChoice {
      font-size: 12px;
      color: black;
      > .unFocus {
        color: #d5d5d5;
      }
    }

    .label {
      margin: 7px;
    }

    .mapContainer {
      display: flex;
      flex-direction: column;
    }
    .mapDesc {
      width: 320px;
      height: 300px;

      border: 1px solid black;
      border-radius: 20px
    }
    .mapInput {
      border: none;
      border-bottom: 1px solid #d5d5d5;
      background-color: white;
      align-self: center;

      margin: 3px 7px;
      margin-top: 10px;
      padding-left: 5px;

      width: 80%;
      height: 20px;
      :focus {
        outline: transparent;
      }
    }

    input {
      border: none;
      border-bottom: 1px solid #d5d5d5;
      background-color: white;

      margin: 3px 7px;
      padding-left: 5px;

      width: 80%;
      height: 20px;
      :focus {
        outline: transparent;
      }
    }
    select {
      border: none;
      border-bottom: 1px solid #d5d5d5;
      background-color: white;

      margin: 3px 7px;

      width: 80%;
      height: 20px;

      text-align: center;
    }
    textarea {
      border: 1px solid #d5d5d5;
      background-color: white;

      padding: 5px;

      width: 95%;
      height: 80px;
      :focus {
        outline: transparent;
      }
    }
    .strDate{
      margin-left: 7px;
      width: 50%;
    }
    .endDate{
      margin-left: 7px;
      width: 50%;
    }
    @media screen and (min-width: 600px) {
      .mapDesc {
        width: 1000px;
        height: 400px;
        margin: 0 auto;
      }
    }
  }

  .btn {
    width: 50%;
    margin: 0 auto;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .error {
    font-family: none;
    font-size: 12px;
    margin: 0 12px;
    color: red;
    margin: 2px 0;
  }

  @media screen and (min-width: 600px) {
    .partyImg {
      width: 700px;
      height: 400px;

      .img {
        width: 100%;
        height: 100%;
      }
    }
  }
`

export const TagInput = styled.div`
  margin: 1.5vh 0.5vh;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: 30px;
  width: 80%;
  border-bottom: 1px solid #d5d5d5;

  > ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;

    > .tag{
      width: auto;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #000;
      padding: 0 8px;
      font-size: 14px;
      list-style: none;
      border-radius: 6px;
      margin: 0 8px 8px 0;
      background: #50C9C3;
      > .tagIcon {
        display: block;
        width: 16px;
        height: 16px;
        text-align: center;
        margin-left: 5px;
        font-size: 14px;
        color: #50C9C3;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
      }
    }
  }
  > .tag-input {
    flex: 1;
    border: none;
    height: 46px;
    font-size: 14px;
    padding: 4px 0 0 0;
    :focus {
      outline: transparent;
    }
  }
`

export const Button = styled.button`
  width: 100%;
  height: 60px;

  border: none;
  border-radius: 20px;
  background-color: #50C9C3;

  font-family: 'SilkscreenBold';
  font-size: 30px;
  color: white;
`

export default function Post () {
  const navigate = useNavigate();
  const [partyInfo, setPartyInfo] = useState({
    image: '',
    name: '',
    startDate: '',
    endDate: '',
    memberLimit: 2,
    region: '',
    privateLink: '',
    content: ''
  });
  const [isName, setIsName] = useState({
    err: false,
    msg: ''
  })
  const [isStrDate, setIsStrDate] = useState({
    err: false,
    msg: ''
  })
  const [isEndDate, setIsEndDate] = useState({
    err: false,
    msg: ''
  })
  const [isContent, setIsContent] = useState({
    err: false,
    msg: ''
  })
  const [isPLink, setIsPLink] = useState({
    err: false,
    msg: ''
  })
  const [isRegion, setIsRegion] = useState({
    err: false,
    msg: ''
  })
  const [tags, setTags] = useState<string[]>([]);
  const [inputTxt, setInputTxt] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target

    setPartyInfo({
      ...partyInfo,
      [name]: value
    })

    if(partyInfo.name !== '') {
      setIsName({
        err: false,
        msg: ''
      })
    }
    if(partyInfo.startDate !== '') {
      setIsStrDate({
        err: false,
        msg: ''
      })
    }
    if(partyInfo.endDate !== '') {
      setIsEndDate({
        err: false,
        msg: ''
      })
    }
    if(partyInfo.region !== '') {
      setIsRegion({
        err: false,
        msg: ''
      })
    }
    if(partyInfo.privateLink !== '') {
      setIsPLink({
        err: false,
        msg: ''
      })
    }
  }
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {name, value} = e.target

    setPartyInfo({
      ...partyInfo,
      [name]: value
    })
    if(partyInfo.content !== '') {
      setIsContent({
        err: false,
        msg: ''
      })
    }
  }
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target

    setPartyInfo({
      ...partyInfo,
      [name]: value
    })
  }

  const handleIsOnline = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if(e.currentTarget.className === 'isOnline' || e.currentTarget.className === 'isOnline unFocus') {
      setIsOnline(true)
    } else {
      setIsOnline(false)
    }
  }
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.code === 'Enter' || e.code === 'Space') {
      if(tags.includes(inputTxt)) {
        return;
      }
      else if(inputTxt === '') {
        return;
      }
      else if(tags.length >= 3) {
        return;
      } 
      else {
        setTags([...tags, inputTxt])
        setInputTxt('')
      }
    }
  }
  const removeTag = (index: number) => {
    setTags(tags.filter((tag) => {
      return tags.indexOf(tag) !== index
    }))
  }

  const postCancelHandler = () => {
    if(cancelModal) {
      setCancelModal(false)
    } else{
      setCancelModal(true)
    }
  }
  const backToPage = () => {
    navigate(-1)
  }

  const signinReducer = useSelector((state: RootReducerType) => state.signinReducer)
  
  const createParty = () => {
    if(partyInfo.name === '') {
      setIsName({
        err: true,
        msg: '파티 이름을 입력해 주십시오'
      })
    }
    if(partyInfo.startDate === '') {
      setIsStrDate({
        err: true,
        msg: '시작일을 선택해 주십시오'
      })
    }
    if(partyInfo.endDate === '') {
      setIsEndDate({
        err: true,
        msg: '마감일을 선택해 주십시오'
      })
    }
    if(partyInfo.content === '') {
      setIsContent({
        err: true,
        msg: '파티 내용을 입력해 주십시오'
      })
    }
    if(partyInfo.region === '') {
      setIsRegion({
        err: true,
        msg: '지역을 선택해 주십시오'
      })
    }
    if(partyInfo.privateLink === '') {
      setIsPLink({
        err: true,
        msg: '연락처를 입력해 주십시오'
      })
    }

    else {
      postParty()
    }
  }

  const postParty = async () => {
    if(!isName.err || !isStrDate.err || !isEndDate.err || !isContent.err || !isRegion.err || !isPLink.err) {
      console.log('응애')
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/list/create`, {
        userId: signinReducer.userInfo?.id,
        partyInfo: {
          name: partyInfo.name,
          image: partyInfo.image,
          memberLimit: partyInfo.memberLimit,
          region: partyInfo.region,
          startDate: partyInfo.startDate,
          endDate: partyInfo.endDate,
          isOnline: isOnline,
          privateLink: partyInfo.privateLink,
          tag: tags
        }
      })
    }
  }
  
  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  const date = year + '-' + month + '-' + day

  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLoggedIn
  );
  if(!isLoggedIn){
    return <Navigate to="/" />
  }
  
  return (
    <PostContainer>
      {cancelModal ?
      <PostCancelModal 
        postCancelHandler={postCancelHandler}
        backToPage={backToPage}
      />
      :
      null
      }
      <PostCard>
        <header>
          <div className='cardHeader'>
            <div className='bubbleMsg'>
              <img className='bubble' alt='bubble' src='img/bubble.png' />
              <span className='headerMsg'>파티 개설</span>
            </div>
            <button className='closeBtn' onClick={() => postCancelHandler()}>
              <FontAwesomeIcon icon={ faTimes } className="icon" /> 
            </button>
          </div>
        </header>
        <fieldset>
          {/* <div className='label'>파티 대표 사진</div> */}
        <div className='partyImg'>
          <FontAwesomeIcon icon={faPlus} className='faPlus' />
          {/* <img className='img' src={partyInfo.image} /> */}
        </div>
        </fieldset>
        <fieldset>
          <div className='label'>파티 이름</div>
          <input
            name='name'
            type='text'
            value={partyInfo.name}
            placeholder='파티 이름은 30자 까지 가능합니다'
            maxLength={30}
            onChange={(e) => {handleInputChange(e)}}
          />
          {isName.err ?
          <div className='error'>{isName.msg}</div> : null}
        </fieldset>
        <fieldset>
          <div className='label'>퀘스트 기간</div>
          <span className='strDate'>시작일</span><br />
          <input
            name='startDate'
            type='date'
            min={date}
            value={partyInfo.startDate}
            onChange={(e) => {handleInputChange(e)}}
          /><br />
          {isStrDate.err ?
          <div className='error'>{isStrDate.msg}</div> : null}
          <span className='endDate'>마감일</span><br />
          <input
            name='endDate'
            type='date'
            min={partyInfo.startDate}
            value={partyInfo.endDate}
            onChange={(e) => {handleInputChange(e)}}
          />
          {isEndDate.err ?
          <div className='error'>{isEndDate.msg}</div> : null}
        </fieldset>
        <fieldset>
          <div className='label'>파티 정원</div>
          <select
            name='memberLimit'
            value={partyInfo.memberLimit}
            onChange={(e) => {handleSelectChange(e)}}
          >
            <option value={2} selected>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
        </fieldset>
        <fieldset>
          <div className='regionTitle'>
            <div className='label'>퀘스트 장소</div>
            <div className='regionChoice'>
              <span className={isOnline === true ? 'unFocus' : ''} onClick={(e) => {handleIsOnline(e)}}>지도에서 보기</span>
              <span> | </span>
              <span className={isOnline === true ? 'isOnline' : 'isOnline unFocus'} onClick={(e) => {handleIsOnline(e)}}>직접 입력</span>
            </div>
          </div>
          {isOnline === false ? 
          <div className='mapContainer'>
            <div id='map' className='mapDesc'>
              <PostMap />
            </div>
            <input 
              className='mapInput'
              name='region'
              type='text'
              value={partyInfo.region}
              onChange={(e) => {handleInputChange(e)}}
            />
          </div>
          :
          <input 
            name='region'
            type='text'
            value={partyInfo.region}
            onChange={(e) => {handleInputChange(e)}}
          />
          }
          {isRegion.err ?
          <div className='error'>{isRegion.msg}</div> : null}
        </fieldset>
        <fieldset>
          <div className='label'>오픈 채팅방 링크</div>
          <input
            placeholder='파티원에게만 공개되는 정보입니다'
            name='privateLink'
            type='text'
            value={partyInfo.privateLink}
            onChange={(e) => {handleInputChange(e)}}
          />
          {isPLink.err ?
          <div className='error'>{isPLink.msg}</div> : null}
        </fieldset>
        <fieldset>
          <div className='label'>태그</div>
          <TagInput>
            <ul id='tags'>
              {tags.map((tag, index) => (
                <li key={index} className='tag'>
                  <span className='tagTitle'>{tag}</span>
                  <span className='tagIcon' onClick={() => {removeTag(index)}}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </li>
              ))}
            </ul>
            <input
              className='tag-input'
              name='tagInput'
              type='text'
              value={inputTxt}
              // placeholder='태그는 3개까지 입력가능합니다'
              placeholder={tags.length === 3 ? '' : '태그는 3개까지 입력가능합니다'}
              onChange={(e) => setInputTxt(e.target.value)}
              onKeyUp={(e) => addTag(e)}
            />
          </TagInput>
        </fieldset>
        <fieldset>
          <div className='label'>퀘스트 내용</div>
          <textarea
            placeholder='모든사람에게 공개되는 정보입니다'
            name='content'
            value={partyInfo.content}
            onChange={(e) => {handleTextareaChange(e)}}
          />
          {isContent.err ?
          <div className='error'>{isContent.msg}</div> : null}
        </fieldset>
        <div className='btn'>
          <Button onClick={createParty}>QUEST</Button>
        </div>
      </PostCard>
    </PostContainer>
  );
}
