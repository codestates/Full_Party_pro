import React, {useState} from 'react';
import axios from 'axios';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faSadTear } from '@fortawesome/free-regular-svg-icons';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../reducers';

export const SearchContainer = styled.div`
  background-color: #fafafa;
  width: 100%;
  height: 100%;

  margin: 60px 0;
`

export const SearchBar = styled.div`
  width: 100%;
  height: 9vh;
  display: flex;

  justify-content: center;
  align-items: center;

  input {
    width: 90%;
    max-width: 1100px;
    height: 5vh;
    padding: 0px 12px;

    border: 1px solid #d5d5d5;
    border-radius: 20px;

    font-size: 20px;
  }

  .faSearch {
    position: absolute;
    left: 85%;

    color: #888;
  }
`

export const RadioBox = styled.div`
  color: #888;
  position: absolute;
  left: 8%;
  bottom: 83%;

  .radio {
    margin: 5px;
    color: black;
  }

  .txt {
    margin-right: 10px;
  }
`

export const SearchContent = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;

  padding-top: 16px;
`

export const NoQuest = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  align-items: center;

  .faSadTear {
    width: 80px;
    height: 80px;
    margin-top: 25vh;
    margin-bottom: 3vh;

    color: grey;
  }

  .noQuestMsg {
    display: flex;
    flex-direction: column;
    align-items: center;

    color: grey;

    .makeQ {
      color: #56C596;
    }
  }
`

export default function Search () {

  const [word, setWord] = useState('')
  const [searchBy, setSearchBy] = useState('byName')
  const [isQuest, setIsQuest] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value)
  }

  const searchQuest = () => {
    console.log(searchBy)
    if(searchBy === 'byName') {
      axios.get(`http://localhost:3000/search?keyword=${word}`)
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    } else {
      axios.get(`http://localhost:3000/search?tagName=${word}`)
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }

  const handleSearchBy = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBy(e.target.value)
  }

  const isLoggedIn = useSelector(
    (state: AppState) => state.userReducer.isLoggedIn
  );

  if(!isLoggedIn){
    return <Navigate to="/" />
  }

  return (
    <SearchContainer>
      <SearchBar>
        <input
          name='word'
          value={word}
          onChange={(e) => handleInputChange(e)}
          placeholder='Search...'
        ></input>
        <FontAwesomeIcon icon={faSearch} className='faSearch' onClick={searchQuest}/>
      </SearchBar>
      <RadioBox>
        <input
          className='radio'
          type='radio'
          name='searchBy'
          value='byName'
          onChange={(e) => handleSearchBy(e)}
          checked
        />
        <span className='txt'>이름으로 검색</span>
        <input
          className='radio'
          type='radio' 
          name='searchBy'
          value='byTag'
          onChange={(e) => handleSearchBy(e)}
        />
        <span className='txt'>태그로 검색</span>
      </RadioBox>
      <SearchContent>
        {isQuest ? <div>여기에 퀘스트카드 렌더링</div> :
        <NoQuest>
          <FontAwesomeIcon icon={faSadTear} className='faSadTear' />
          <div className='noQuestMsg'>
            <div>주변에 퀘스트가 없어요!</div>
            <div>직접
              <Link to='/post' style={{ textDecoration: 'none' }}>
                <span className='makeQ'> 퀘스트</span>
              </Link>
              를 만들어 파티를 모집해 보세요!</div>
          </div>
        </NoQuest>}
      </SearchContent>
    </SearchContainer>
  );
}
