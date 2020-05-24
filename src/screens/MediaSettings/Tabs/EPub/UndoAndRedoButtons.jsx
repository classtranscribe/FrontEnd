import React, { useEffect } from 'react';
import { Popup } from 'semantic-ui-react';
import { Button } from 'pico-ui';
import { epub } from '../../Utils/epub';

function UndoAndRedoButtons({
  buttonColor = 'black',
  buttonClasses = '',
  hideOnDiabled = true,
}) {
  useEffect(() => {
    epub.history.clear();    
  }, []);

  return (
    <>
      {
        (epub.history.canUndo || !hideOnDiabled)
        &&
        <Popup
          basic
          inverted
          content="Undo last action"
          disabled={!epub.history.canUndo}
          trigger={
            <div className={buttonClasses}>
              <Button
                round // size="big"
                icon="undo"
                text="Undo"
                color={buttonColor}
                onClick={epub.history.undo}
                disabled={!epub.history.canUndo}
              />
            </div>
          }
        />
      }

      {
        (epub.history.canRedo || !hideOnDiabled)
        &&
        <Popup
          basic
          inverted
          content="Redo last action"
          disabled={!epub.history.canRedo}
          trigger={
            <div className={buttonClasses}>
              <Button
                round // size="big"
                icon="redo"
                text="Redo"
                color={buttonColor}
                onClick={epub.history.redo}
                disabled={!epub.history.canRedo}
              />
            </div>
          }
        />
      }
    </>
  );
}

export default UndoAndRedoButtons;
