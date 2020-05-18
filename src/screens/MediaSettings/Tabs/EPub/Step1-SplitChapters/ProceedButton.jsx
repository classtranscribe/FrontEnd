import React from 'react';
import { Button } from 'pico-ui';
import { epub } from '../../../Utils/epub';

function ProceedButton() {
  return (
    <div className="msp-ee-act ct-a-fade-in">
      <Button round size="big"
        classNames="ee-act-btn ee-act-save-btn"
        icon="arrow_forward"
        text="Proceed to Chapter Editor"
        color="teal"
        onClick={epub.proceedToStep2}
      />

      {/* <Button round size="big"
        classNames="ee-act-btn"
        text="Cancel"
        color="black"
        onClick={() => epub.cancelEditChapters()}
      /> */}
    </div>
  );
}

export default ProceedButton;

