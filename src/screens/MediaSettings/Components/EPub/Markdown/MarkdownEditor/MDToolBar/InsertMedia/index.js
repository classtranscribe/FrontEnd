import React, { useState } from 'react';
import './index.scss';

import InsertMediaTrigger from './InsertMediaTrigger';
import ImagePickerModal from '../../../../ImagePickerModal';
import { getImageUrl } from 'screens/MediaSettings/Utils/epub/util';
import { insertImgae } from '../ace.util';

export default function InsertMedia({
  ace,
  screenshots=[],
  chapterScreenshots=[],
  defaultImage,
}) {

  const [pickImg, setPickImage] = useState(false);

  const openImagePicker = () => setPickImage(true);
  const closeImagePicker = () => setPickImage(false);

  const onSave = newImage => {
    let imgsrc = getImageUrl(newImage);
    insertImgae(ace, imgsrc);
    
    closeImagePicker();
  }

  return (
    <>
      <InsertMediaTrigger 
        onClick={openImagePicker}
      />
      <ImagePickerModal
        show={pickImg}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
        defaultImage={defaultImage}
        onClose={closeImagePicker}
        onSave={onSave}
      />
    </>
  )
}