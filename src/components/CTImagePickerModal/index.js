import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';
import { CTModal, makeEl } from 'layout';
import './index.scss';

import ImagesTab from './ImagesTab';
import UploadTab from './UploadTab';
import VideoTab from './VideoTab';
import ImagePickerModalActions from './ImagePickerModalActions';

/**
 * An image picker modal
 */
function ImagePickerModal(props) {
  const {
    show = false,
    onSave,
    onClose,
    tabs = [],
    defaultImage,
    sourceType, 
    sourceId,
    playerData
  } = props;

  const [imgUrl, setImgUrl] = useState(defaultImage);

  const onSaveImage = (url) => {
    if (!onSave) return;
    if (typeof url === 'string') {
      onSave(url);
    } else {
      onSave(imgUrl);
    }
  };

  useEffect(() => {
    setImgUrl(defaultImage);
  }, [defaultImage]);

  let panes = _.map(tabs, tab => {
    if (tabs.length === 0 || (typeof tab === 'string' && tab === 'upload')) {
      return {
        menuItem: 'Upload',
        render: () => (
          <Tab.Pane>
            <UploadTab
              imgUrl={imgUrl}
              setImgUrl={setImgUrl}
              sourceType={sourceType}
              sourceId={sourceId}
            />
          </Tab.Pane>
        )
      };
    } 

    if (typeof tab === 'string' && tab === 'video' && playerData) {
      return {
        menuItem: 'Capture in Video',
        render: () => (
          <Tab.Pane>
            <VideoTab
              onSaveImage={onSaveImage}
              sourceType={sourceType}
              sourceId={sourceId}
              {...playerData}
            />
          </Tab.Pane>
        )
      };
    }
    
    if (tab.name && Array.isArray(tab.images)) {
      return {
        menuItem: tab.name,
        render: () => (
          <Tab.Pane>
            <ImagesTab 
              images={tab.images}
              description={tab.description}
              imgUrl={imgUrl}
              setImgUrl={setImgUrl} 
            />
          </Tab.Pane>
        )
      };
    }
  });

  const actionElement = makeEl(ImagePickerModalActions, {
    canSave: Boolean(imgUrl),
    onSave: onSaveImage,
    onClose
  });

  return (
    <CTModal
      size='md'
      open={show}
      title="Choose an Image"
      onClose={onClose}
      withCloseButton
      action={actionElement}
    >
      <Tab panes={panes} />
    </CTModal>
  );
}

ImagePickerModal.propTypes = {
  /** True if display the modal */
  show: PropTypes.bool,

  /** The default image url */
  defaultImage: PropTypes.string,

  /** The tabs of images for  */
  tabs: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      /** The name of the tab */
      name: PropTypes.string,
      /** The images to be shown in the tab */
      images: PropTypes.arrayOf(PropTypes.string),
      /** Discription of the tab */
      description: PropTypes.node,
    })
  ])),

  /** callback on save the picked image (will pass in the picked image) */
  onSave: PropTypes.func,

  /** callback on close the modal */
  onClose: PropTypes.func,

  sourceType: PropTypes.number, 
  sourceId: PropTypes.string,
  playerData: PropTypes.any
};

export default ImagePickerModal;
