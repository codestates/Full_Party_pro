import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';

export const MapContainer = styled.section`

  width: 100%;
  display: flex;
  justify-content: center;

  #map {
    margin-top: 10px;
  }

  .infoWindow {
    position: relative;
    bottom: 85px;
    border-radius: 20px;
    float:left;
    border: 1px solid #ccc;
    border-bottom:2px solid #ddd;
  }

  .infoWindow:nth-of-type(n) {
    border: 0; 
    box-shadow: 0px 1px 2px #999;
  }
  
  .infoWindow a {
    display:block;
    text-decoration:none;
    color:#000;
    text-align:center;
    border-radius:20px;
    font-size:14px;
    font-weight:bold;
    overflow:hidden;
    background: #50C9C3 url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png') 
    no-repeat right 14px center;
  }

  .infoWindow .title {
    display:block;
    text-align:center;
    background:#fff;
    margin-right:35px;
    padding:10px 15px;
    font-size:14px;
    font-weight:bold;
  }

  .infoWindow:after {
    /* // 그림자 없는 것
    content: '';
    position:absolute;
    margin-left:-12px;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: #fff;
    border-bottom: 0;
    margin-left: -10px;
    margin-bottom: -10px; */

    content:'';
    position:absolute;
    margin-left:-12px;
    left:50%;
    bottom:-12px;
    width:22px;
    height:12px;
    background:url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')
  }

  .partyImg {
    width: 27px;
    height: 27px;
    border-radius: 100%;
    border: 2px solid #fff;
  }
`;

type Props = {
  localParty: Array<{ [key: string]: any }>
};

export default function LocalMap ({ localParty }: Props) {

  const { kakao } = window;

  const geocoder = new kakao.maps.services.Geocoder();
  const [coords, setCoords] = useState({ lat: 37.496562, lng: 127.024761 });
  const { lat, lng } = coords;
  

  useEffect(() => {

  }, [localParty]);

  return (
    <MapContainer>
      <Map
        center={{ lat: lat + 0.001, lng: lng - 0.0001 }}
        style={{ width: "100%", height: "250px" }}
        level={5}
        onZoomChanged={(map) => map.setLevel(map.getLevel() < 5 ? 5 : map.getLevel())}
      >
      </Map>
    </MapContainer>
  )
}