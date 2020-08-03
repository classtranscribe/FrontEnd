import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment } from 'layout';
import { epub } from '../controllers';

function ProceedButton() {
  return (
    <CTFragment fade vCenter className="ct-epb sch proceed-btns">
      <Button
        round
        size="big"
        classNames="ct-epb shadow-btn"
        icon="arrow_forward"
        text="Proceed to Chapter Editor"
        color="teal"
        onClick={epub.ctrl.proceedToStep2}
      />
    </CTFragment>
  );
}

export default ProceedButton;

