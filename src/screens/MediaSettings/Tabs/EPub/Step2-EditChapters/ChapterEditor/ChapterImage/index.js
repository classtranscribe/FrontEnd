import React, { useState, useEffect } from 'react';
import { Button } from 'pico-ui';
import './index.scss';
import { epub } from 'screens/MediaSettings/controllers/epub';

import ImagePickerModal from '../../../ImagePickerModal';

function ChapterImage({
  id,
  image = '',
  screenshots = [],
  chapterScreenshots = [],

  onChooseImage,
  onRemoveImage,
}) {
  const [pickImg, setPickImage] = useState(false);

  const openImagePicker = () => setPickImage(true);
  const closeImagePicker = () => setPickImage(false);

  const onSave = (newImage) => {
    if (onChooseImage) {
      onChooseImage(newImage);
    }

    closeImagePicker();
  };

  const handleOnKeyDown = ({ keyCode }) => {
    if (keyCode === 13 || keyCode === 32) {
      openImagePicker();
    }
  };

  useEffect(() => {
    if (pickImg) {
      setPickImage(false);
    }
  }, [image]);

  return (
    <>
      {image ? (
        <div id={id} className="ee-ech-ch-img-con">
          <img src={epub.getImageUrl(image)} alt="Cover" />
          <div
            tabIndex="0"
            className="ee-ech-ch-img-wrapper"
            onClick={openImagePicker}
            onKeyDown={handleOnKeyDown}
            role="button"
          >
            Click to Choose Image
          </div>

          {Boolean(onRemoveImage) && (
            <Button
              round
              classNames="ee-ech-ch-img-rm-btn"
              icon="delete"
              text="Remove this image."
              onClick={onRemoveImage}
            />
          )}
        </div>
      ) : (
        <div className="ee-ech-ch-text-con">
          <div
            className="ee-ech-ch-text"
            tabIndex={0}
            onClick={openImagePicker}
            onKeyDown={handleOnKeyDown}
            role="button"
          >
            <div className="text-muted">Click to insert images</div>
          </div>
        </div>
      )}

      <ImagePickerModal
        show={pickImg}
        onSave={onSave}
        onClose={closeImagePicker}
        defaultImage={image}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
      />
    </>
  );
}

export default ChapterImage;
