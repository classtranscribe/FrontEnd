import React, { useState } from 'react';
import { api } from 'utils';
import './index.scss';

import ImagePickerModal from '../../../ImagePickerModal';

function ChapterImage({
  image='',
  onChooseImage,
  screenshots=[],
}) {

  const [pickImg, setPickImage] = useState(false);

  const openImagePicker = () => setPickImage(true);
  const closeImagePicker = () => setPickImage(false);

  const onSave = () => {
    if (onChooseImage) {
      onChooseImage(pickImg);
    }
    
    closeImagePicker();
  }

  let imageUrl = image.startsWith('blob') 
               ? image 
               : api.getMediaFullPath(image);
  
  return Boolean(image) ? (
    <div className="ee-ech-ch-img-con">
      <img src={imageUrl} alt="Cover image" />
      <div tabIndex="0" className="ee-ech-ch-img-wrapper">
        Click to Choose Image
      </div>

      <ImagePickerModal
        show={pickImg}
        onSave={onSave}
        onClose={closeImagePicker}
        defaultImage={image}
        screenshots={screenshots}
      />
    </div>
  ) : null;
}

export default ChapterImage;
