import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment } from 'layout';

function UploadActions({
  noFileUploaded,
  uploading,
  handleClose,
  handleUpload
}) {
  return (
    <CTFragment hCenter padding={[10, 0]}>
      <Button.Group>
        <Button
          uppercase
          color="teal"
          disabled={noFileUploaded}
          onClick={handleUpload}
        >
          Upload Videos
        </Button>

        <Button
          uppercase
          color="transparent"
          disabled={uploading}
          onClick={handleClose}
        >
          Cancel
        </Button>
      </Button.Group>
    </CTFragment>
  );
}

export default UploadActions;
