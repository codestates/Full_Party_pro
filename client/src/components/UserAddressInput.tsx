import React, { useState } from 'react';
import styled from 'styled-components';
import UserMap from '../components/UserMap';
import PostCodeModal from '../components/PostCodeModal';

export const AddressInputContainer = styled.div`
  input:disabled {
    background-color: white;
  }

  #map {
    width: 100%;
    height: 150px;
    margin-bottom: 8px;
  }
`;

type Props = {
  profileImage: string,
  address: string,
  handleAddressChange: Function,
  isSearch: boolean,
  searchHandler: Function
};

export default function UserAddressInput({ profileImage, address, handleAddressChange, isSearch, searchHandler }: Props) {
  const [ fullAddress, setFullAddress ] = useState({
    address: "",
    detailedAddress: "",
    extraAddress: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { address, extraAddress } = fullAddress;
    setFullAddress({
      ...fullAddress,
      detailedAddress: event.target.value,
    });
    handleAddressChange(`${address} ${event.target.value} ${extraAddress ? `(${extraAddress})` : ''}`);
  };

  const autoCompleteHandler = (address: string, extraAddress: string) => {
    if (!!fullAddress.detailedAddress)
      handleAddressChange(`${address} ${fullAddress.detailedAddress} ${extraAddress ? `(${extraAddress})` : ''}`);
    else
      handleAddressChange(`${address} ${extraAddress ? `(${extraAddress})` : ''}`);

    setFullAddress({
      ...fullAddress,
      address,
      extraAddress,
    });
    searchHandler();
  };

  const inputValue = fullAddress.address === '' ? '' : fullAddress.address + " " + (fullAddress.extraAddress ? `(${fullAddress.extraAddress})` : '')

  return (
    <AddressInputContainer>
      <div className='mapContainer'>
        <div id='map' className='mapDesc'>
          <UserMap
            address={address}
            image={profileImage} 
          />
        </div>
      </div>

      <input id="fullAddress" type="text" value={inputValue} placeholder="주소" disabled={true} /><br />
      <input type="text" 
        onChange={handleInputChange}
        value={fullAddress.detailedAddress} 
        placeholder="상세주소" 
        autoComplete='off'
      />

      {isSearch ?
        <PostCodeModal
          searchHandler={searchHandler}
          autoCompleteHandler={autoCompleteHandler}
        />
      : null}
    </AddressInputContainer>
  );
}