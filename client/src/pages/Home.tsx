import React from 'react';

import styled from 'styled-components';

export const HomeContainer = styled.div`
  width: 100%;
  height: 100%;

  margin: 60px 0;
`

function Home () {
  return (
    <HomeContainer>
      <div>홈</div>
    </HomeContainer>
  );
}


export default Home;