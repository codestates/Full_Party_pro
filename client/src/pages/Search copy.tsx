import React, {useState} from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faSadTear } from '@fortawesome/free-regular-svg-icons';
import { Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../reducers';
import { RootReducerType } from '../store/store';
import { searchParty } from '../actions/search';
import axios from 'axios';

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
  margin: 0 auto;

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
    left 86%;

    color: #888;
  }

  @media screen and (min-width: 1000px) {
    .faSearch {
      left 79%;
    }
  }
`

export const SearchContent = styled.div`
  width: 100%;
  min-height: 75vh;
  display: flex;
  margin: 0 auto;

  padding-top: 16px;
`

export const NoQuest = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;

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
  const dispatch = useDispatch()
  const [word, setWord] = useState('')
  const [isSearch, setIsSearch] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value)
  }

  const searchReducer = useSelector((state: RootReducerType) => state.searchReducer)
  const signinReducer = useSelector((state: RootReducerType) => state.signinReducer)
  const searchRegion = signinReducer.userInfo?.region

  const searchQuest = () => {
    dispatch(searchParty(word, searchRegion, 'byKeyword'))
    setIsSearch(true)
  }
  const enterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      searchQuest()
    }
  }
  //태그 검색 요청이 들어오면 이걸 실행해 주세요
  const searchTag = (tag: string) => {
    dispatch(searchParty(tag, searchRegion, 'byTag'))
    setIsSearch(true)
  }
  //--------------------------------//

  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLogin
  );

  if(!isLoggedIn){
    return <Navigate to="/" />
  }

  return (
    <SearchContainer>
      <SearchBar>
        {/* <div>{keyword}</div> */}
        <input
          name='word'
          value={word}
          onChange={(e) => handleInputChange(e)}
          onKeyUp={(e) => enterKey(e)}
          placeholder='Search...'
        ></input>
        <div className='faSearch' onClick={searchQuest}>
          {/* 검색 결과를 가져온 뒤 스토어에 저장합니다. */}
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </SearchBar>
      <SearchContent>
        {(() => {
          if(!isSearch) {
            return (
              <div />
            )
          }
          else if(isSearch && searchReducer.parties.length !== 0) {
            return(
              <div>여기에 퀘스트카드 렌더링</div>
            )
          }
          else if(isSearch && searchReducer.parties.length === 0) {
            return(
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
              </NoQuest>
            )
          }
        })()}
      </SearchContent>
    </SearchContainer>
  );
}
