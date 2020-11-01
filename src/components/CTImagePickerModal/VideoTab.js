import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment } from 'layout';
import CTPlayer from 'components/CTPlayer';
import { _uploadImageFile } from './UploadTab';

function VideoTab({
  onSaveImage,
  sourceType, 
  sourceId,
  ...playerData
}) {

  const handleSaveImage = (img) => async () => {
    const imgData = await _uploadImageFile(img.blob, sourceType, sourceId);
    if (!imgData) {
      return;
    }

    onSaveImage(imgData.imageFile.path);
  };

  const actionElem = (img) => (
    <CTFragment justConEnd>
      <Button
        compact
        round
        color="white"
        onClick={handleSaveImage(img)}
        classNames="ml-2"
        autoFocus
      >
        Choose this one
      </Button>
    </CTFragment>
  );

  return (
    <div className="ct-img-picker-con">
      <CTFragment>
        <CTPlayer
          fill
          allowScreenshot
          screenshotActionElement={actionElem}
          {...playerData}
        />
      </CTFragment>
    </div>
  );
}

export default VideoTab;
