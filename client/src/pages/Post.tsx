import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AppState } from '../reducers';

import axios from 'axios';
import Map from '../components/Map';
import { RootReducerType } from '../store/store'
import userReducer from '../reducers/userReducer';

export const PostContainer = styled.div`
  width: 100%;
  position: absolute;
  background-color: #d5d5d5;

  z-index: 1000;
`

export const PostCard = styled.div`
  width: 85%;
  min-height: 20vh;
  margin: 3vh auto;
  margin-bottom: 80px;
  background-color: white;

  border: none;
  border-radius: 20px;
  padding-bottom: 2vh;

  font-family: 'DungGeunMo';

  .cardHeader {
    display: flex;
    background-color: darkcyan;
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
    height: 120px;
    display: flex;

    justify-content: center;
    align-items: center;

    margin: 3vh auto;

    border: 1px solid silver;
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

    .map {
      width: 320px;
      height: 300px;

      border: 1px solid black;
      border-radius: 20px
    }
    .hidden {
      width: 0px;
      height: 0px;
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

      width: 55%;
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
      .map {
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
  }

  @media screen and (min-width: 600px) {
    .partyImg {
      width: 700px;
      height: 400px;
    }
  }
`

export const TagInput = styled.div`
  margin: 1.5vh 0.5vh;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: 30px;
  width: 95%;
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
      background: #4000x7;
      > .tagIcon {
        display: block;
        width: 16px;
        height: 16px;
        text-align: center;
        font-size: 14px;
        color: #4000c7;
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
  background-color: darkcyan;

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
    memberLimit: '',
    content: '',
    privateLink: '',
    region: ''
  });
  const [tags, setTags] = useState<string[]>([]);
  const [inputTxt, setInputTxt] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target

    setPartyInfo({
      ...partyInfo,
      [name]: value
    })
  }
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {name, value} = e.target

    setPartyInfo({
      ...partyInfo,
      [name]: value
    })
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
    if(e.code === 'Enter') {
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

  // useEffect(() => {
  //   let container = document.getElementById('map');
  //   let options = {
  //     center: new window.kakao.maps.LatLng(33.450701, 126.570667),
  //     level: 3
  //   };

  //   let map = new window.kakao.maps.Map(container, options);
  // },[isOnline])

  const signinReducer = useSelector((state: RootReducerType) => state.signinReducer)

  const createParty = async () => {
    const res = await axios.post('http://localhost:3000/list/create', {
      userId: signinReducer.userInfo?.id,
      partyInfo: {
        name: partyInfo.name,
        image: partyInfo.image,
        memberLimit: partyInfo.memberLimit,
        content: partyInfo.content,
        startDate: partyInfo.startDate,
        endDate: partyInfo.endDate,
        isOnline: isOnline,
        privateLink: partyInfo.privateLink,
        region: partyInfo.region,
        tag: tags
      }
    })
    
    console.log(res)
  }

  const isLoggedIn = useSelector(
    (state: AppState) => state.userReducer.isLoggedIn
  );
  if(!isLoggedIn){
    return <Navigate to="/" />
  }
  
  return (
    <PostContainer>
      <PostCard>
        <header>
          <div className='cardHeader'>
            <div className='bubbleMsg'>
              <img className='bubble' alt='bubble' src='img/bubble.png' />
              <span className='headerMsg'>파티 개설</span>
            </div>
            <button className='closeBtn' onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={ faTimes } className="icon" /> 
            </button>
          </div>
        </header>
        <div className='partyImg'>
          <FontAwesomeIcon icon={faPlus} className='faPlus' />
          <div>기본 이미지는 뭐로하지</div>
        </div>
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
        </fieldset>
        <fieldset>
          <div className='label'>퀘스트 기간</div>
          <span className='strDate'>시작일</span>
          <input
            name='startDate'
            type='date'
            value={partyInfo.startDate}
            onChange={(e) => {handleInputChange(e)}}
          /><br />
          <span className='endDate'>마감일</span>
          <input
            name='endDate'
            type='date'
            min={partyInfo.startDate}
            value={partyInfo.endDate}
            onChange={(e) => {handleInputChange(e)}}
          />
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
          <div id='map' className='map'>
            <Map
              isMember={false}
              location={partyInfo.region}
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
              placeholder='태그는 3개까지 입력가능합니다'
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
        </fieldset>
        <div className='btn'>
          <Button onClick={createParty}>QUEST</Button>
        </div>
      </PostCard>
    </PostContainer>
  );
}
