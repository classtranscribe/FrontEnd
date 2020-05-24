import React, { useState, useEffect } from 'react';
import { Button } from 'pico-ui';
import './index.scss';

import { epub } from 'screens/MediaSettings/Utils/epub';

import EpubStepper from '../../Stepper';
import UndoAndRedoButtons from '../../UndoAndRedoButtons';

function Toolbar() {
  const [showUndo, setShowUndo] = useState(false);

  useEffect(() => {
    setShowUndo(true);
  }, []);

  return (
    <div className="msp-ee-ech-tb bottom ct-a-fade-in">
      <EpubStepper vertical />

      <div className="ee-ech-tb-btns mt-5">
        <div className="d-flex flex-row">
          {
            showUndo 
            && 
            <UndoAndRedoButtons 
              buttonColor="primary"
              hideOnDiabled={false}
              buttonClasses="ee-ech-tb-btn ee-ech-tb-btn-me undo-redo-btn"
            />
          }
        </div>
      </div>

      <div className="ee-ech-tb-btns">
        <Button
          round
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me"
          color="black"
          icon="arrow_back"
          onClick={epub.ech.backToStep1}
        >
          Back to Chapter Splitter
        </Button>
        <Button
          round
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me"
          color="teal"
          icon="arrow_forward"
          onClick={epub.ech.proceedToStep3}
        >
          Proceed to ePub Downloader
        </Button>
      </div>
    </div>
  );
}

export default Toolbar;
