import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment } from 'layout';
import { epub } from '../controllers';
import { EPubStepper } from '../components';
import './index.scss';

function Toolbar() {
  return (
    <CTFragment list className="ct-epb ech tool-bar" data-scroll>
      <EPubStepper vertical />

      <CTFragment>
        <Button
          round
          className="ech tool-bar-btn"
          color="black"
          icon="arrow_back"
          onClick={epub.ctrl.backToStep1}
        >
          Back to Chapter Splitter
        </Button>
        <Button
          round
          className="ech tool-bar-btn"
          color="teal"
          icon="arrow_forward"
          onClick={epub.ctrl.proceedToStep3}
        >
          Proceed to ePub Downloader
        </Button>
      </CTFragment>
    </CTFragment>
  );
}

export default Toolbar;