import React from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import DaumPostcode from 'react-daum-postcode';

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
  width: 90%;
  max-width: 350px;
  max-height: 90vh;

  border-radius: 30px;
  background-color: white;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

  padding: 30px;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const CloseBtn = styled.button`

  margin-bottom: 20px;

  background-color: white;
  border: none;
  color: #000;   

  margin-right: 10px;

  cursor: pointer;
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

type Props = {
  searchHandler: Function,
  autoCompleteHandler: Function,
}

const PostCodeModal = ({ searchHandler, autoCompleteHandler }: Props) => {

  const closeModal =() => {
    searchHandler();
  }

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = ''; 
    
    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }
    
    autoCompleteHandler(data.address, extraAddress);   
  }

  return(
    <ModalContainer>
      <ModalBackdrop onClick={closeModal}>
        <ModalView onClick={(e) => e.stopPropagation()}>
          <CloseBtn onClick={closeModal}><FontAwesomeIcon icon={faTimes} /></CloseBtn>
          <DaumPostcode
            onComplete={handleComplete}
          />
        </ModalView>
      </ModalBackdrop>
    </ModalContainer>
  )
}

export default PostCodeModal;