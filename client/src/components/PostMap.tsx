import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  .infoWindow {
    position: relative;
    bottom: 85px;
    border-radius: 20px;
    float:left;
    border: 1px solid #ccc;
    border-bottom:2px solid #ddd;

    width: 130px;
  }

  .infoWindow:nth-of-type(n) {
    border: 0; 
    box-shadow: 0px 1px 2px #999;
  }
  
  .infoWindow div {
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

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .infoWindow:after {
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
`

type Props = {
  location: string,
  name: string,
  image: string,
  handleCoordsChange: Function,
}

const PostMap = ({ location, name, image, handleCoordsChange }: Props) => {
  
  const { kakao } = window;

  const [coords, setCoords] = useState({ lat: 37.496562, lng: 127.024761 });
  const { lat, lng } = coords;

  const geocoder = new kakao.maps.services.Geocoder();

  useEffect(() => {

    if(location){
      geocoder.addressSearch(location, function(result: any, status: any) {
        if (status === kakao.maps.services.Status.OK) {
          const coordinates = new kakao.maps.LatLng(result[0].y, result[0].x);
          const { La, Ma } = coordinates;
          setCoords({ lat: Ma, lng: La });
          handleCoordsChange(Ma, La);
        }
      });  
    }
    
  },[location])

  if(!location){
    return (
      <MapContainer>
        <Map
          center={{ lat: lat + 0.001, lng: lng - 0.0001 }}
          style={{ width: "100%", height: "100%" }}
          level={4}
          onZoomChanged={(map) => map.setLevel(map.getLevel() > 7 ? 7 : map.getLevel())}
        />
      </MapContainer>
    )
  }

  return (
    <MapContainer>
      <Map
        center={{ lat: lat + 0.001, lng: lng - 0.0001 }}
        style={{ width: "100%", height: "100%" }}
        level={4}
        onZoomChanged={(map) => map.setLevel(map.getLevel() > 7 ? 7 : map.getLevel())}
      >
        <MapMarker
          position={coords}
          image={{
            src: "../img/mapMarker.png",
            size: { width: 50, height: 50 },
            options: { offset: { x: 24.15, y: 69 } },
          }}
        />
        <CustomOverlayMap
          position={coords}
          yAnchor={2.4}
        >
          <div className="partyImg" style={{background: `url(${image})`, backgroundPosition: "center", backgroundSize: "cover"}} />
        </CustomOverlayMap>
        <CustomOverlayMap
          position={coords}
          yAnchor={1}
        >
          <div className="infoWindow">
            <div>
              <span className="title">{name ? name : "퀘스트 장소"}</span>
            </div>
          </div>
        </CustomOverlayMap>
      </Map>
    </MapContainer>
  )
}

export default PostMap;