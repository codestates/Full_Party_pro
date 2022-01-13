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
  localParty: Array<{ [key: string]: any }>
};

export default function LocalMap ({ localParty }: Props) {

  const { kakao } = window;

  const geocoder = new kakao.maps.services.Geocoder();
  const [coords, setCoords] = useState({ lat: 37.496562, lng: 127.024761 });
  const { lat, lng } = coords;
  const [positions, setPositions] = useState(localParty.map((party) => { return ({title: party.name, latlng: { lat: 0, lng: 0 }})}));
  
  

  useEffect(() => {
    // const localPositions = localParty.map((party) => {
    //   const res = geocoder.addressSearch(party.location, function(result: any, status: any) {
    //     if (status === kakao.maps.services.Status.OK) {
    //       const coordinates = new kakao.maps.LatLng(result[0].y, result[0].x);
    //       const { La, Ma } = coordinates;
  
    //       return ({ title: party.name, latlng: { lat: Ma, lng: La } });
    //     }
    //   })
  
    //   return res;
    // });

    // setPositions(localPositions);
  }, []);

  return (
    <MapContainer>
      <Map
        center={{ lat: lat + 0.001, lng: lng - 0.0001 }}
        style={{ width: "100%", height: "250px" }}
        level={5}
        onZoomChanged={(map) => map.setLevel(map.getLevel() < 5 ? 5 : map.getLevel())}
      >

      {/* {positions.map((position: { title: string, latlng: { lat: number, lng: number }}, index: number) => (
        <MapMarker
          key={`${position.title}-${position.latlng}`}
          position={position.latlng} // 마커를 표시할 위치
          image={{
            src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 마커이미지의 주소입니다
            size: {
              width: 24,
              height: 35
            }, // 마커이미지의 크기입니다
          }}
          title={position.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        />
      ))} */}

      {localParty.map((party, idx) => {
          const res = geocoder.addressSearch(party.location, function(result: any, status: any) {
            if (status === kakao.maps.services.Status.OK) {
              const coordinates = new kakao.maps.LatLng(result[0].y, result[0].x);
              const { La, Ma } = coordinates;
      
              return ({ title: party.name, latlng: { lat: Ma, lng: La } });
            }
          })

          return (
            <>
             <MapMarker
                position={res.latlng}
                image={{
                  src: "img/mapMarker.png",
                  size: { width: 50, height: 50 },
                  options: { offset: { x: 24.15, y: 69 } },
                }}
              />
              <CustomOverlayMap
                position={res.latlng}
                yAnchor={2.4}
              >
                <div className="partyImg" style={{background: `url(${party.image})`, backgroundSize: "cover"}} />
              </CustomOverlayMap>
            
              <CustomOverlayMap
                position={res.latlng}
                yAnchor={1}
              >
                <div className="infoWindow">
    
                  <a
                    href={`https://map.kakao.com/link/map/퀘스트장소,${lat},${lng}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="title">{party.name}</span>
                  </a>
                </div>
              </CustomOverlayMap>`
            </>
          )
        })
      }

{/*      
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
              <div className="partyImg" style={{background: `url(${party.image})`, backgroundSize: "cover"}} />
            </CustomOverlayMap>
          
            <CustomOverlayMap
              position={coords}
              yAnchor={1}
            >
              <div className="infoWindow">
   
                <a
                  href={`https://map.kakao.com/link/map/퀘스트장소,${lat},${lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="title">{party.name}</span>
                </a>
              </div>
            </CustomOverlayMap> */}
      </Map>
    </MapContainer>
  )
}