import React, { useState } from 'react';
import styled from 'styled-components';
import PostMap from '../components/PostMap';
import PostCodeModal from '../components/PostCodeModal';

export const AddressInputContainer = styled.div`
  input:disabled {
    background-color: white;
  }
`;

export const Tab = styled.div`
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .tabButton {
    button {
      width: 50px;
      color: #000;
      background-color: white;
      border: none;
      font-weight: bold;
      cursor: pointer;

      &.unfocused {
        font-weight: normal;
        color: #777;
      }
    }
  }

  .searchBtn {
    width: 100px;
    height: 35px;
    border: none;
    border-radius: 20px;
    background-color: #50C9C3;
    color: white;
    cursor: pointer;
  }
`;

type Props = {
  partyInfo: {[key: string]: any},
  handleCoordsChange: Function,
  handleLocationChange: Function,
  handleOnOff: Function
};

const AddressInput = ({ partyInfo, handleCoordsChange, handleLocationChange, handleOnOff }: Props) => {
  const [ isSearch, setIsSearch ] = useState(false);
  const [ isOnline, setIsOnline ] = useState(false);
  const [ onlineLocation, setOnlineLocation ] = useState('');
  const [ fullAddress, setFullAddress ] = useState({
    address: "",
    detailedAddress: "",
    extraAddress: "",
  });

  const searchHandler = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => setIsSearch(!isSearch);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { address, extraAddress } = fullAddress;
    setFullAddress({
      ...fullAddress,
      detailedAddress: event.target.value,
    });
    handleLocationChange(`${address} ${event.target.value} ${extraAddress ? `(${extraAddress})` : ''}`);
  }

  const autoCompleteHandler = (address: string, extraAddress: string) => {
    if (!!fullAddress.detailedAddress)
      handleLocationChange(`${address} ${fullAddress.detailedAddress} ${extraAddress ? `(${extraAddress})` : ''}`);
    else
      handleLocationChange(`${address} ${extraAddress ? `(${extraAddress})` : ''}`);
    setFullAddress({
      ...fullAddress,
      address,
      extraAddress,
    });
    setIsSearch(false);
  }

  const onlineLocationHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnlineLocation(event.target.value);
    handleLocationChange(event.target.value);
  }

  const handleIsOnline = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.className === 'isOnline' || e.currentTarget.className === 'isOnline unfocused') {
      setIsOnline(true);
      setFullAddress({
        address: '',
        detailedAddress: '',
        extraAddress: '',
      });
      handleOnOff(true);
      handleLocationChange('');
    }
    else {
      setIsOnline(false);
      setOnlineLocation('');
      handleOnOff(false);
      handleLocationChange('');
    }
  }

  const inputValue = fullAddress.address === '' ? '' : fullAddress.address + " " + (fullAddress.extraAddress ? `(${fullAddress.extraAddress})` : '');

  return (
    <AddressInputContainer>
      <Tab>
        <div className="tabButton">
          <button className={isOnline ? 'unfocused' : ''} onClick={handleIsOnline}>오프라인</button>
          <span> | </span>
          <button className={isOnline ? 'isOnline' : 'isOnline unfocused'} onClick={handleIsOnline}>온라인</button>
        </div>
        {!isOnline ? <button className="searchBtn" onClick={searchHandler}>주소 검색</button> : null} 
      </Tab> 
      {isOnline?
        <input 
          type='text'
          value={onlineLocation}
          onChange={onlineLocationHandler}
          autoComplete='off'
        />
      : <>
          <div className='mapContainer'>
            <div id='map' className='mapDesc'>
              <PostMap 
                location={partyInfo.location} 
                name={partyInfo.name}
                image={partyInfo.image} 
                handleCoordsChange={handleCoordsChange}
              />
            </div>
          </div>
        
          <input id="fullAddress" type="text" value={inputValue} placeholder="주소" disabled={true} /><br />
          <input type="text" 
            onChange={handleInputChange}
            value={fullAddress.detailedAddress} 
            placeholder="상세주소" 
            autoComplete="off"
          />
        </>
      }
    
      {isSearch ?
        <PostCodeModal
          searchHandler={searchHandler}
          autoCompleteHandler={autoCompleteHandler}
        />
      : null}
    </AddressInputContainer>
  );
}

export default AddressInput;