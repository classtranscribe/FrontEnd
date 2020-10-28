import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment, CTHeading } from 'layout';
import { epub } from '../../controllers';
const Constants = epub.const;

function EditOptions() {
  const onEditFile = (view) => () => {
    epub.state.setView(view);
  };

  const onEditFileInfo = () => {
    epub.state.setShowFileSettings(true);
  };

  return (
    <CTFragment margin={[0,0,30,0]}>
      <CTHeading as="h3" icon="edit">Edit File</CTHeading>
      <CTFragment dFlexCol padding={[0,15,0,0]}>
        <Button
          icon="description"
          color="transparent"
          onClick={onEditFileInfo}
        >
          Edit ePub information
        </Button>
        <Button
          icon="layers"
          //className="mt-2"
          color="transparent"
          onClick={onEditFile(Constants.EpbEditStructure)}
        >
          Edit ePub structure
        </Button>
        <Button
          icon="dashboard"
          //className="mt-2"
          color="transparent"
          onClick={onEditFile(Constants.EpbEditChapter)}
        >
          Edit chapters
        </Button>
      </CTFragment>
    </CTFragment>
  );
}

export default EditOptions;
