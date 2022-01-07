import React, { useEffect } from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import mapMarker from '../static/mapMarker.png';

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

export default function Map ({ isMember, location, image }: Props) {

  const { kakao } = window;

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(127.024761, 37.496562),
      level: 4,
    };

    const map = new kakao.maps.Map(container, options);
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(location, function(result: any, status: any) {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        const { La, Ma } = coords;

        const infoWindow = '<div class="infoWindow">' +
          `  <a href="https://map.kakao.com/link/map/퀘스트장소,${Ma.toFixed(6)},${La.toFixed(6)}" target="_blank">` +
          '    <span class="title">퀘스트 장소</span>' +
          '  </a>' +
          '</div>';

        if(isMember){

          // 로컬 이미지로 변경할 것
          const imageSrc = 'https://i.imgur.com/V8PN3K3.png',    
          imageSize = new kakao.maps.Size(50, 50),
          imageOption = {offset: new kakao.maps.Point(24.15, 69)};
            
          const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

          const marker = new kakao.maps.Marker({
            map: map,
            position: coords,
            image: markerImage,
          });

          marker.setMap(map);

          const partyImg = `<div class="partyImg" style="background: url(${image}); background-size: cover;">`;

          const infoWindowOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: coords,
            content: infoWindow,
            yAnchor: 1 
          });

          const partyImgOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: coords,
            content: partyImg,
            yAnchor: 2.4
          });

          const mapCenter = new kakao.maps.LatLng(Ma + 0.001, La - 0.0001);

          map.setCenter(mapCenter);

        } else {

          const circle = new kakao.maps.Circle({
            center : coords,  // 원의 중심좌표 입니다 
            radius: 800, // 미터 단위의 원의 반지름입니다 
            strokeWeight: 1, // 선의 두께입니다 
            strokeColor: '##50C9C3', // 선의 색깔입니다
            strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            fillColor: '#50C9C3', // 채우기 색깔입니다
            fillOpacity: 0.4  // 채우기 불투명도 입니다   
          }); 

          circle.setMap(map); 

          const infoWindowPosition = new kakao.maps.LatLng(Ma - 0.002, La - 0.0001);

          const infoWindowOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: infoWindowPosition,
            content: infoWindow,
          });

          const mapCenter = new kakao.maps.LatLng(Ma + 0.001, La - 0.0001);
          map.setCenter(mapCenter);
        }
      } 
    }); 

    if(!isMember){
      map.setLevel(5);
      map.setZoomable(false);
    }

    kakao.maps.event.addListener(map, 'zoom_changed', function() {
      const level = map.getLevel();
      if( level > 6 ){
        map.setLevel(6);
      }
    });
  }, [])
    
  return (
    <MapContainer>
      <div id="map" style={{ 
        minWidth: "90vw", 
        height: "250px",
      }} />
    </MapContainer>
  )
}