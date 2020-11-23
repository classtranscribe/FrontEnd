import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment, CTFormHelp } from 'layout';
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

  const cameraIcon = <i className="material-icons">camera_alt</i>;

  return (
    <div className="ct-img-picker-con">
      <CTFragment dFlexCol>
        <CTFormHelp title="INSTRUCTION">
          When watching the video, You are able to capture screenshots by 
          clicking the camera-like button at top-right of the player.
        </CTFormHelp>
        <CTFragment>
          <CTPlayer
            fill
            allowScreenshot
            screenshotActionElement={actionElem}
            {...playerData}
          />
        </CTFragment>
      </CTFragment>
    </div>
  );
}

export default VideoTab;
