import React from 'react';
import { Button } from 'pico-ui';
import { CTPopoverLabel } from 'layout';
import { epub } from '../controllers';

function UndoRedoButtons() {
  return (
    <div className="ct-epb sch undo-redo-btns d-flex">
      <CTPopoverLabel label="Undo" disabled={!epub.history.canUndo}>
        <div>
          <Button
            round
            color="black"
            icon="undo"
            className="mr-1"
            onClick={epub.history.undo}
            disabled={!epub.history.canUndo}
            aria-label="undo"
          />
        </div>
      </CTPopoverLabel>

      <CTPopoverLabel label="Redo" disabled={!epub.history.canRedo}>
        <div>
          <Button
            round
            color="black"
            icon="redo"
            className="ml-1"
            onClick={epub.history.redo}
            disabled={!epub.history.canRedo}
            aria-label="redo"
          />
        </div>
      </CTPopoverLabel>
    </div>
  );
}

export default UndoRedoButtons;
