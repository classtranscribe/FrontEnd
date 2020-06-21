import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { uurl } from 'utils/use-url';
import ImagePickerModal from '../../../../CTImagePickerModal';
import { insertImgae } from '../../ace/ace-controller';
import InsertMediaTrigger from './InsertMediaTrigger';

function InsertMedia(props) {
  const {
    ace,
    imageTabs,
    defaultImage,
  } = props;

  const [pickImg, setPickImage] = useState(false);

  const openImagePicker = () => setPickImage(true);
  const closeImagePicker = () => setPickImage(false);

  const onSave = (newImage) => {
    const imgsrc = uurl.getMediaUrl(newImage);
    insertImgae(ace, imgsrc);

    closeImagePicker();
  };

  return (
    <>
      <InsertMediaTrigger onClick={openImagePicker} />
      <ImagePickerModal
        show={pickImg}
        tabs={imageTabs}
        defaultImage={defaultImage}
        onClose={closeImagePicker}
        onSave={onSave}
      />
    </>
  );
}

InsertMedia.propTypes = {
  ace: PropTypes.any,
  imageTabs: ImagePickerModal.propTypes.tabs,
  defaultImage: PropTypes.string,
};

export default InsertMedia;
