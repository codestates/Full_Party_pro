import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import UserMap from './UserMap';
import { AppState } from '../reducers';
import { useDispatch, useSelector } from 'react-redux';
import { SIGNIN_SUCCESS } from '../actions/signinType';

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .error {
    font-size: 0.7rem;
    color: #f34508;
    margin-top: 5px;
  }
`

export const MapContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;

  img {
    width: 50px;
    height: 50px;
  }

  .mapTitle {
    font-weight: bold;
    margin-bottom: 5px;
    margin-top: 10px;
  }

  .details {
    font-size: 0.8rem;
    color: #777;
    margin-bottom: 20px;
  }

  #map {
    width: 100%;
    height: 150px;
  }

  input {
    width: 100%;
    height: 25px;
    border: none;
    border-bottom: 1px solid #d5d5d5;
    margin: 15px 0;

    &:focus {
      outline-style:none;
    }
  }

`

export const BtnContainer = styled.section`
  width: 100%;
  display: flex;
  justify-content: space-between;

  button {
    width: 90px;
    height: 40px;
    border: none;
    border-radius: 10px;
    background-color: white;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      &.left {
        margin-right: 5px;
      }

      &.right {
        margin-left: 5px;
      }
    }

    &.request {
      background-color: #50C9C3;
      color: #fff;
    }
  }
`

export default function  AddressModal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ pageIdx, setPageIdx ] = useState(0);
  const [ address, setAddress ] = useState('');
  const [ fixedLocation, setFixedLocation ] = useState('');
  const [ formatAddress, setFormatAddress ] = useState('');
  const [ errorMsg, setErrorMsg ] = useState('');

  const userInfo = useSelector(
    (state: AppState) => state.signinReducer.userInfo
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  }

  const handleFormatAddressChange = (address: string) => {
    setFormatAddress(address);
  }

  const handleSearchLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter' || e.code === 'Space' || e.code === 'ArrowRight') setFixedLocation(address);
  }

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const toGo = (event.currentTarget as HTMLButtonElement).value;
    if (toGo === "next") setPageIdx(pageIdx + 1);
    else setPageIdx(pageIdx - 1);
  }

  const handleAddressRegister = async () => {
    if (address) {
      setErrorMsg('');
      const res = await axios.patch(`${process.env.REACT_APP_API_URL}/user/address/${userInfo.id}`, {
        userId: userInfo.id, address: formatAddress
      });

      if (res.status === 200) {
        dispatch({
          type: SIGNIN_SUCCESS,
          payload: {
            ...userInfo,
            address: formatAddress
          }
        });
        navigate('../');
      }
    }
    else setErrorMsg('주소를 입력해주세요.');
  }

  return(
    <ModalContainer>
      <ModalBackdrop>
        <ModalView>
          {pageIdx === 0 ?
            <>
              <MapContainer>
                <div className="mapInfo">
                    <img src="img/404logo.png" alt="logo" />
                    <div className="mapTitle">주소를 등록해주세요!</div>
                    <div className="details">이 위치를 기반으로 퀘스트가 검색됩니다.</div>
                </div>
                <div id='map' className='mapDesc'>
                    <UserMap 
                    location={fixedLocation} 
                    image={userInfo.profileImage} 
                    handleFormatAddressChange={handleFormatAddressChange}
                    />
                </div>
                <input 
                    className='mapInput'
                    name='address'
                    type='text'
                    value={address}
                    onChange={(e) => handleInputChange(e)}
                    onKeyUp={(e) => handleSearchLocation(e)}
                />
              </MapContainer>
              <BtnContainer style={{ justifyContent: "flex-end" }}>
                <button onClick={handlePageChange} value="next">다음 <FontAwesomeIcon icon={faAngleRight} className="icon right" /></button>
              </BtnContainer> 
            </>
          : null}
          {pageIdx === 1 ?
            <>
              <div className='confirm'>이 정보가 맞나요?</div>
                <table>
                  <tr>
                    <td className='label'>주소</td>
                    <td className='info'>{!address ? '' : formatAddress}</td>
                  </tr>
                </table>
              <div className='error'>{errorMsg}</div>
              <BtnContainer>
                <button onClick={handlePageChange} value="prev"><FontAwesomeIcon icon={faAngleLeft} className="icon left" /> 이전</button>
                <button onClick={handleAddressRegister} className="request">제출</button>
              </BtnContainer>
            </>
          : null}
        </ModalView>
      </ModalBackdrop>
    </ModalContainer>
  )
}