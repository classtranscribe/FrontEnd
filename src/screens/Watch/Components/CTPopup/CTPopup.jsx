import React, { useState, useEffect } from 'react';
import { videoTimestamp } from '../ControlBar/TimeDisplay';

const CTPopup = (props) => {
  return (
    <h1>{videoTimestamp}</h1>
  )
}

export default CTPopup;