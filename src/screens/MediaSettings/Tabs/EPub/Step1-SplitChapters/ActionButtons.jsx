import React, { useState, useEffect } from 'react';

import UndoAndRedoButtons from '../UndoAndRedoButtons';

function ActionButtons() {
  const [showUndo, setShowUndo] = useState(false);

  useEffect(() => {
    setShowUndo(true);
  }, []);

  return (
    <div className="sch-act-buttons">
      {
        showUndo
        &&
        <UndoAndRedoButtons
          buttonClasses="sch-act-btn"
          buttonColor="primary"
        />
      }
    </div>
  );
}

export default ActionButtons;
