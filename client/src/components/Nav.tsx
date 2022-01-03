import React from 'react';

import styled from 'styled-components';

export const NavContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 7vh;
`;

export default function Nav () {

  return (
    <NavContainer>
      <div>내비게이션 바</div>
    </NavContainer>
  );
}
