import React, { useState } from 'react';
import './index.scss';

import InsertMediaTrigger from './InsertMediaTrigger';
import ImagePickerModal from '../../../../ImagePickerModal';

export default function InsertMedia({
  ace,
  screenshots=[],
  defaultImage,
  onChooseImage,
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

  return (
    <>
      <InsertMediaTrigger 
        onClick={openImagePicker}
      />
      <ImagePickerModal
        ace={ace}
        show={pickImg}
        screenshots={screenshots}
        defaultImage={defaultImage}
        onClose={closeImagePicker}
        onSave={onSave}
      />
    </>
  )
}