import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

import { Map, MapMarker, CustomOverlayMap, Circle } from 'react-kakao-maps-sdk';

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
  isMember: boolean,
  location: string,
  image: string,
};

export default function PartyMap ({ isMember, location, image }: Props) {

  const { kakao } = window;

  const [coords, setCoords] = useState({ lat: 37.496562, lng: 127.024761 });
  const { lat, lng } = coords;

  const level = (isMember ? 4 : 5);
  const zoomable = (isMember ? true : false);

  useEffect(() => {

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(location, function(result: any, status: any) {
      if (status === kakao.maps.services.Status.OK) {
        const coordinates = new kakao.maps.LatLng(result[0].y, result[0].x);
        const { La, Ma } = coordinates;
        setCoords({ lat: Ma, lng: La });
      }
    });

  }, []);

  return (
    <MapContainer>
      <Map
        center={{ lat: lat + 0.001, lng: lng - 0.0001 }}
        style={{ width: "100%", height: "250px" }}
        level={level}
        zoomable={zoomable}
        onZoomChanged={(map) => map.setLevel(map.getLevel() > 7 ? 7 : map.getLevel())}
      >
        {isMember ?
          <>
            <MapMarker
              position={coords}
              image={{
                src: "img/mapMarker.png",
                size: { width: 50, height: 50 },
                options: { offset: { x: 24.15, y: 69 } },
              }}
            />
            <CustomOverlayMap
              position={coords}
              yAnchor={2.4}
            >
              <div className="partyImg" style={{background: `url(${image})`, backgroundSize: "cover"}} />
            </CustomOverlayMap>
          </>
        : 
          <Circle
            center={coords}
            radius={800}
            strokeWeight={1}
            strokeColor={"#50C9C3"}
            strokeOpacity={0.5}
            fillColor={"#50C9C3"}
            fillOpacity={0.4}
          />
        }
        <CustomOverlayMap
          position={isMember ? coords : { lat: lat - 0.002, lng: lng - 0.0001}}
          yAnchor={1}
        >
          <div className="infoWindow">
            {isMember ? 
              <a
                href={`https://map.kakao.com/link/map/퀘스트장소,${lat},${lng}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="title">퀘스트 장소</span>
              </a>
            : 
              <a>
                <span className="title">퀘스트 장소</span>
              </a>
            }
          </div>
        </CustomOverlayMap>
      </Map>
    </MapContainer>
  )
}