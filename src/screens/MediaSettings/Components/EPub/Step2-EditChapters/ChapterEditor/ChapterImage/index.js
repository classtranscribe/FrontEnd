import React, { useState } from 'react';
import { Button } from 'pico-ui';
import './index.scss';
import { epub } from 'screens/MediaSettings/Utils/epub';

import ImagePickerModal from '../../../ImagePickerModal';

function ChapterImage({
  id,
  image='',
  screenshots=[],
  onChooseImage,
  onRemoveImage,
}) {

  const [pickImg, setPickImage] = useState(false);

  const openImagePicker = () => setPickImage(true);
  const closeImagePicker = () => setPickImage(false);

  const onSave = newImage => {
    if (onChooseImage) {
      onChooseImage(newImage);
    }
    
    closeImagePicker();
  }

  const handleOnKeyDown = ({ keyCode }) => {
    if (keyCode === 13 || keyCode === 32) {
      openImagePicker();
    }
  }
  
  return (
    <>
    {
      Boolean(image)
      ?
      <div id={id} className="ee-ech-ch-img-con">
        <img src={epub.getImageUrl(image)} alt="Cover image" />
        <div
          tabIndex="0" 
          className="ee-ech-ch-img-wrapper"
          onClick={openImagePicker}
          onKeyDown={handleOnKeyDown}
        >
          Click to Choose Image
        </div>

        <Button round
          classNames="ee-ech-ch-img-rm-btn"
          icon="delete"
          text="Remove this image."
          onClick={onRemoveImage}
        />
      </div>
      :
      <div className="ee-ech-ch-text-con">
        <div
          className="ee-ech-ch-text"
          tabIndex={0}
          onClick={openImagePicker}
          onKeyDown={handleOnKeyDown}
        >
          <div className="text-muted">Click to insert images</div>
        </div>
      </div>
    }

    <ImagePickerModal
      show={pickImg}
      onSave={onSave}
      onClose={closeImagePicker}
      defaultImage={image}
      screenshots={screenshots}
    />
    </>
  );
}

export default ChapterImage;
