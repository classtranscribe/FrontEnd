import React from 'react';
import { Popup } from 'semantic-ui-react';
import { Button } from 'pico-ui';
import { epub } from '../../Utils/epub';

function UndoAndRedoButtons({
  buttonClasses='',
}) {
  return (
    <>
      {
        epub.history.canUndo
        &&
        <Popup
          basic
          inverted
          content="Undo last action"
          trigger={
            <div className={buttonClasses}>
              <Button
                round // size="big"
                icon="undo"
                text="Undo"
                color="black"
                onClick={epub.history.undo}
              />
            </div>
          }
        />
      }

      {
        epub.history.canRedo
        &&
        <Popup
          basic
          inverted
          content="Redo last action"
          trigger={
            <div className={buttonClasses}>
              <Button
                round // size="big"
                icon="redo"
                text={epub.history.canUndo ? null : "Redo"}
                color="black"
                onClick={epub.history.redo}
              />
            </div>
          }
        />
      }
    </>
  );
}

export default UndoAndRedoButtons;
