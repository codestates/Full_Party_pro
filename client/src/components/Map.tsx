import React, { useEffect } from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const MapContainer = styled.section`

  width: 100%;
  display: flex;
  justify-content: center;
  /* padding: 10px 20px 20px 20px; */

  #map {
    margin-top: 10px;
  }

  img {
    width: 100%;
    max-height: 200px;
    border-radius: 20px;
    border: 1px solid #d5d5d5;
  }
`;

type Props = {
  isMember: boolean,
  location: string,
};

export default function Map ({ isMember, location }: Props) {

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667), //지도 중심좌표
      level: 3, //지도 레벨(확대, 축소 정도)
    };

    const map = new window.kakao.maps.Map(container, options);
  }, [])
    
  return (
    <MapContainer>
      <div id="map" style={{ 
        minWidth: "90vw", 
        height: "25vh",
      }} />
    </MapContainer>
  )
}