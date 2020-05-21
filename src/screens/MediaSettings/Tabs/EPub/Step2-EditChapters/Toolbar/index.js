import React from 'react';
import { Button } from 'pico-ui';
import './index.scss';

import { epub } from 'screens/MediaSettings/Utils/epub';

function Toolbar() {
  return (
    <div className="msp-ee-ech-tb ct-a-fade-in bottom">
      <div className="ee-ech-tb-btns">
        <Button
          round
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me"
          color="black"
          icon="arrow_back"
          onClick={epub.backToStep1}
        >
          Back to Chapter Splitter
        </Button>
        <Button
          round
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me"
          color="teal"
          icon="arrow_forward"
          onClick={epub.proceedToStep3}
        >
          Proceed to ePub Downloader
        </Button>
      </div>
    </div>
  );
}

export default Toolbar;
