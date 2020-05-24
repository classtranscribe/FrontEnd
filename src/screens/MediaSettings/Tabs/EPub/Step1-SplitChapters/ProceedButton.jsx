import React from 'react';
import { Button } from 'pico-ui';
import { epub } from '../../../Utils/epub';

function ProceedButton() {
  return (
    <div className="sch-act-buttons proceed-btns ct-a-fade-in">
      <Button
        round
        size="big"
        classNames="sch-act-btn"
        icon="arrow_forward"
        text="Proceed to Chapter Editor"
        color="teal"
        onClick={epub.sch.proceedToStep2}
      />

      {/* <Button round size="big"
        classNames="sch-proceed-btn"
        text="Cancel"
        color="black"
        onClick={() => epub.sch.cancelEditChapters()}
      /> */}
    </div>
  );
}

export default ProceedButton;

