import React from 'react';
import { CTImagePickerModal } from 'components';


function ImagePickerModal({
  show = false,
  onSave,
  onClose,
  screenshots = [],
  chapterScreenshots = [],
  defaultImage,
}) {
  let tabs = [
    {
      name: 'All Screenshots',
      images: screenshots,
    },
    'upload'
  ];

  if (chapterScreenshots.length > 0) {
    tabs = [{
      name: 'Chapter Screenshots',
      images: chapterScreenshots
    }, ...tabs];
  }

  const imgPickerProps = {
    show,
    defaultImage,
    tabs,
    onSave,
    onClose
  };

  return (
    <CTImagePickerModal {...imgPickerProps} />
  );
}

export default ImagePickerModal;
