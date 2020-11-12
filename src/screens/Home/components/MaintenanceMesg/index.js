import React from 'react';
import { CTFragment, CTText } from 'layout';

function MaintenanceMesg() {
  return (
    <CTFragment styles={{ background: 'teal' }} justConCenter padding="15">
      <CTText white bold size="medium">
        ClassTranscribe will be unavailable for a few hours 
        Friday afternoon CT (Nov 13) due to network maintenance
      </CTText>
    </CTFragment>
  );
}

export default MaintenanceMesg;
