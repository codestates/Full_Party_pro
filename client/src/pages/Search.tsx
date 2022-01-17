import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../reducers';
import { RootReducerType } from '../store/store';
import { searchParty } from '../actions/search';

import LocalQuest from '../components/LocalQuest';
import EmptyCard from '../components/EmptyCard';

// [dev] 더미데이터
import dummyList from '../static/dummyList';

export const SearchContainer = styled.div`
  width: 100%;
  height: 100%;

  margin: 60px 0;
  padding: 20px 0;

  display: flex;
  flex-direction: column;
  align-items: center;
`

export const SearchBar = styled.div`
  width: 100%;
  height: 40px;

  display: flex;
  margin: 15px 0;

  justify-content: center;
  align-items: center;

  input {
    width: 90%;
    max-width: 1100px;
    height: 5vh;
    padding: 0px 20px;

    border: 1px solid #d5d5d5;
    border-radius: 20px;

    font-size: 1.1rem;
  }

  .faSearch {
    position: absolute;
    right: 10%;

    color: #888;
    cursor: pointer;
  }

  @media screen and (min-width: 650px) {
    .faSearch {
      right: 8%;
    }
  }

  @media screen and (min-width: 1000px) {
    .faSearch {
      right: 20%;
    }
  }
`

export const SearchContent = styled.div`
  padding: 16px 1%;

  padding-top: 16px;

  .result {
    width: 100%;
    height: 100%;

    padding: 0 30px;

    .resultLabel {
      font-size: 1.7rem;
      font-weight: bold;

      margin-bottom: 15px;
    }
  }

  .tag {
    padding: 8px 15px;
    margin: 0 10px 15px 0;

    font-size: 0.8rem;

    background-color: #fff;
    border-radius: 20px;
    border: 1px solid #d5d5d5;
    color: #777;

    cursor: pointer;
  }

  @media screen and (min-width: 700px) {
    padding: 16px 4%;
  }
`

export default function Search () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const isLoggedIn = useSelector(
    (state: AppState) => state.signinReducer.isLoggedIn
  );

  const searchReducer = useSelector((state: RootReducerType) => state.searchReducer);
  const signinReducer = useSelector((state: RootReducerType) => state.signinReducer);
  const searchRegion = signinReducer.userInfo?.region;

  const [word, setWord] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  //[dev] 더미데이터입니다.
  const [tag, setTag] = useState(['태그1', '태그2', '태그333333333', '태그1', '태그2', '태그333333333', '태그1', '태그2', '태그333333333'])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value)
  }

  const searchQuest = () => {
    dispatch(searchParty(word, searchRegion, 'byKeyword'))
    setIsSearch(true)
    navigate(`/search/${word}`)
  }
 
  const enterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      searchQuest()
    }
  }

  function hashtagHandler(tag: string){
    setWord(tag);
    dispatch(searchParty(tag, searchRegion, 'byTag'));
    setIsSearch(true);
  }

  useEffect(() => {
    if(params.tag){
      const tag = params.tag;
      setWord(tag);
      dispatch(searchParty(tag, searchRegion, 'byTag'));
      setIsSearch(true);
    }
  },[])

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
          onKeyUp={(e) => enterKey(e)}
          placeholder='검색어를 입력해주세요'
        />
        <div className='faSearch' onClick={searchQuest}>
          {/* 검색 결과를 가져온 뒤 스토어에 저장합니다. */}
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </SearchBar>
      <SearchContent>
        {(() => {
          if(!isSearch) {
            return (
              <div className='result'>
                <div className='resultLabel'>
                  인기 태그
                </div>
                <div className='hashtag'>
                  {tag.map((t, idx) => 
                    <button 
                      key={idx} 
                      className="tag" 
                      onClick={() => hashtagHandler(t)}
                      style={isLoggedIn ? { cursor: "pointer" } : { cursor: "default" }}
                      disabled={!isLoggedIn}
                    >
                      #{t}
                    </button>
                  )}
                </div>
              </div>
              //[dev]기본화면 카드 렌더링 테스트용
              // <div className='result'>
              //   <div className='resultLabel'>
              //     검색 결과
              //   </div>
              // {dummyList.localParty.map((party, idx) => <QuestCard key={idx} party={party} />)}
              // </div>
            )
          }
          else if(isSearch && searchReducer.parties.length !== 0) {
            return(
              <div className='result'>
                <LocalQuest location={searchRegion} localParty={searchReducer.parties} /> 
              </div>
            )
          }
          else if(isSearch && searchReducer.parties.length === 0) {
            return (
              <EmptyCard from="search" />
            )
          }
        })()}
      </SearchContent>
    </SearchContainer>
  );
}
