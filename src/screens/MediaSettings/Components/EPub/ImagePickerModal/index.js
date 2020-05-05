import React, { useState } from 'react';
import { Tab } from 'semantic-ui-react';
import { CTModal } from 'components';
import './index.scss'

import ScreenshotTab from './ScreenshotTab';
import UploadTab from './UploadTab';
import ImagePickerModalActions from './ImagePickerModalActions';

function ImagePickerModal({
  show=false,
  onSave,
  onClose,
  screenshots,
  defaultImage,
}) {

  const [imgUrl, setImgUrl] = useState(defaultImage);

  const onSaveImage = () => {
    if (onSave) {
      onSave(imgUrl);
    }
  }

  const panes = [
    { 
      menuItem: 'Screenshots', 
      render: () => (
        <Tab.Pane>
          <ScreenshotTab 
            screenshots={screenshots} 
            imgUrl={imgUrl} 
            setImgUrl={setImgUrl}
          /> 
        </Tab.Pane>
      )
    },
    { 
      menuItem: 'Upload', 
      render: () => (
        <Tab.Pane>
          <UploadTab
            imgUrl={imgUrl}
            setImgUrl={setImgUrl}
          />
        </Tab.Pane>
      ) },
  ];

  return (
    <CTModal large
      show={show}
      title="Choose Cover Image"
      onClose={onClose}
      actions={
        <ImagePickerModalActions 
          onSave={onSaveImage}
          onClose={onClose}
        />
      }
    >
      <Tab panes={panes} />
    </CTModal>
  );
}

export default ImagePickerModal;
