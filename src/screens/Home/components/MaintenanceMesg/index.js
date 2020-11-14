import React from 'react';
import { CTFragment, CTText } from 'layout';

function MaintenanceMesg({ message }) {
  return message ? (
    <CTFragment styles={{ background: 'teal' }} justConCenter padding="15">
      <CTText white bold size="medium">
        {message}
      </CTText>
    </CTFragment>
  ) : null;
}

export default MaintenanceMesg;
