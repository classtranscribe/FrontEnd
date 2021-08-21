import React, { useState } from 'react';
import './index.scss';

import InteractiveLayer from './InteractiveLayer';
import NonInteractiveLayer from './NonInteractiveLayer';

function Wrapper(props) {
  const { screenshotActionElement } = props;
  const [userActive, setUserActive] = useState(true);

  return (
    <div
      className='ctp wrapper'
      onMouseEnter={() => setUserActive(true)}
      onMouseLeave={() => setUserActive(false)}
    >
      <NonInteractiveLayer />
      <InteractiveLayer userActive={userActive} screenshotActionElement={screenshotActionElement} />
    </div>
  );
}

export default Wrapper;