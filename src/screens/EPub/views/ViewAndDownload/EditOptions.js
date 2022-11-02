import React from 'react';
import { connect } from 'dva'
import { Button } from 'pico-ui';
import { CTFragment, CTHeading } from 'layout';
import { epub } from '../../controllers';

const Constants = epub.const;

function EditOptions({ dispatch }) {
  const onEditFile = (view) => () => {
    dispatch({ type: 'epub/setView', payload: view });
  };

  const onEditFileInfo = () => {
    dispatch({ type: 'epub/setShowFileSettings', payload: true });
  };

  return (
    <CTFragment margin={[0, 0, 30, 0]}>
      <CTHeading as="h3" icon="edit">Edit File</CTHeading>
      <CTFragment dFlexCol padding={[0, 15, 0, 0]}>
        <Button
          icon="description"
          color="transparent"
          onClick={onEditFileInfo}
        >
          Edit I-Note information
        </Button>
        <Button
          icon="layers"
          // className="mt-2"
          color="transparent"
          onClick={onEditFile(Constants.EpbEditStructure)}
        >
          Edit I-Note structure
        </Button>
        <Button
          icon="dashboard"
          // className="mt-2"
          color="transparent"
          onClick={onEditFile(Constants.EpbEditChapter)}
        >
          Edit chapters
        </Button>
      </CTFragment>
    </CTFragment>
  );
}

export default connect(({ loading }) => ({

}))(EditOptions);
