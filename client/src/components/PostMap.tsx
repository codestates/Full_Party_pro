import React, { useEffect } from "react";
import styled from "styled-components";

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`

const PostMap = () => {
  const { kakao } = window;

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.496562, 127.024761),
      // draggable: false, 지도 이동 및 확대 축소 금지 옵션
      level: 4
    };

    const map = new kakao.maps.Map(container, options);
    // const geocoder = new kakao.maps.services.Geocorder();

    // //이 부분은 max 줌아웃을 설정하는 부분인가요?
    // kakao.maps.event.addListener(map, 'zoom_changed', function() {
    //   const level = map.getLevel();
    //   if( level > 6 ){
    //     map.seLevel(6)
    //   }
    // });
  },[])

  return (
    <MapContainer>
      <div id='map' style={{
        minWidth: '100%',
        minHeight: '100%',
        borderRadius: '20px',
      }} />
    </MapContainer>
  )
}

export default PostMap;