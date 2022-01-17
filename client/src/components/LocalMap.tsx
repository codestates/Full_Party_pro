import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

    width: 100px;
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
  
  .infoWindow .navigate {
    display:block;
    text-decoration:none;
    color:#000;
    text-align:center;
    border-radius:20px;
    font-size:14px;
    font-weight:bold;
    overflow:hidden;
  }

  .infoWindow .title {
    display:block;
    text-align:center;
    background:#fff;
    /* margin-right:22px; */
    padding:10px 15px;
    font-size:10px;
    font-weight:bold;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    width: 16px;
    height: 16px;
    border-radius: 100%;
    border: 1px solid #fff;
  }
`;

type Props = {
  location: string,
  localParty: Array<{ [key: string]: any }>,
};

export default function LocalMap ({ location, localParty }: Props) {

  const { kakao } = window;
  const navigate = useNavigate();

  const geocoder = new kakao.maps.services.Geocoder();
  const [coords, setCoords] = useState({ lat: 37.496562, lng: 127.024761 });

  type p = {
    party: { [key: string]: any },
  };

  const EventMarkerContainer = ({ party }: p) => {
    const [isVisible, setIsVisible] = useState(false)

    return (
      <>
        <MapMarker
          position={party.latlng}
          image={{
            src: "img/mapMarker.png",
            size: { width: 30, height: 30 },
            options: { offset: { x: 15, y: 52 } },
          }}
          onClick={() => navigate(`../party/${party.id}`)}
          onMouseOver={() => setIsVisible(true)}
          onMouseOut={() => setIsVisible(false)}
        />
        <CustomOverlayMap
          position={party.latlng}
          yAnchor={3.1}
        >
          <div className="partyImg" 
            onClick={() => navigate(`../party/${party.id}`)} 
            onMouseOver={() => setIsVisible(true)}
            onMouseOut={() => setIsVisible(false)}
            style={{background: `url(${party.image})`, backgroundSize: "cover"}} 
          />
        </CustomOverlayMap>
       
        {isVisible? 
          <CustomOverlayMap
            position={party.latlng}
          >
            <div className="infoWindow">
              <div className="navigate" onClick={() => navigate(`../party/${party.id}`)}>
                <span className="title">{party.name}</span>
              </div>
            </div>
          </CustomOverlayMap>
        : null}
      </>
    )
  }

  useEffect(() => {

    geocoder.addressSearch(location, function(result: any, status: any) {
      if (status === kakao.maps.services.Status.OK) {
        const coordinates = new kakao.maps.LatLng(result[0].y, result[0].x);
        const { La, Ma } = coordinates;
        setCoords({ lat: Ma, lng: La });
      }
    });

    // const test = coordsSearch();
    // console.log("테스트");
    // console.log(test);

    // const localPositions: Array<any> = [];

    // for(let i = 0; i < localParty.length; i++){
    //   geocoder.addressSearch(localParty[i].location, function(result: any, status: any) {
    //     if (status === kakao.maps.services.Status.OK) {
    //       const coordinates = new kakao.maps.LatLng(result[0].y, result[0].x);
    //       const { La, Ma } = coordinates;
    //       localPositions.push({ title: localParty[i].name, latlng: { lat: Ma, lng: La }, image: localParty[i].image });
    //     }
    //   })
    // }



    // const localPositions = localParty.map((party) => {
      
    //   const test = geocoder.addressSearch(party.location, function(result: any, status: any) {
    //     if (status === kakao.maps.services.Status.OK) {
    //       const coordinates = new kakao.maps.LatLng(result[0].y, result[0].x);
    //       const { La, Ma } = coordinates;
    //       const res = { title: party.name, latlng: { lat: Ma, lng: La }, image: party.image };

    //       console.log(res)
    //       // res 잘 출력됨
    //       // 0번 인덱스: {title: '등 긁어주실 분...', latlng: {…}, image: 'https://pbs.twimg.com/media/Es4KAp3U4AM01nT?format=jpg'}
    //       // 1번 인덱스: {title: '더미 파티', latlng: {…}, image: 'https://img.theqoo.net/flOqo'}
    //       return res;
    //     }
    //   })

    //   console.log(test)
    //   // 값: undefined
    //   return test;
    // });

    // console.log(localPositions);
    //값: [undefined, undefined]

  }, [localParty]);

  return (
    <MapContainer>
      <Map
        center={coords}
        style={{ width: "100%", height: "250px" }}
        level={5}
        onZoomChanged={(map) => map.setLevel(map.getLevel() < 5 ? 5 : map.getLevel())}
      >
      {localParty.map((party, index) => (
        <EventMarkerContainer
          key={index}
          party={party}
        />
      ))}
      </Map>
    </MapContainer>
  )
}