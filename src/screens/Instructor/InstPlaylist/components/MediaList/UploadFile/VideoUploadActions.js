import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment } from 'layout';

function VideoUploadActions({
  noFileUploaded,
  uploading,
  handleClose,
  handleUpload
}) {
  return (
    <CTFragment justConCenter padding={[10, 0]}>
      <Button.Group>
        <Button
          uppercase
          color="teal"
          disabled={uploading || noFileUploaded}
          onClick={handleUpload}
        >
          Upload Video
        </Button>

        <Button
          uppercase
          color="transparent"
          onClick={handleClose}
        >
          Cancel
        </Button>
      </Button.Group>
    </CTFragment>
  );
}

export default VideoUploadActions;
