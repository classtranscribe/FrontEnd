import React from 'react';
import { Button } from 'pico-ui';
import './index.scss';

import { epub, connectWithRedux } from 'screens/MediaSettings/Utils/epub';


function Toolbar() {
  return (
    <div className="msp-ee-ech-tb ct-a-fade-in">
      <div className="ee-ech-tb-btns top">
        <Button round
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me" 
          color="black" 
          icon="settings"
          onClick={epub.backToStep1}
        >
          Back to chapter splitter
        </Button>
      </div>
    </div>
  );
}

export default connectWithRedux(
  Toolbar,
  []
)