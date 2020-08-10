import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';
import { CTModal, makeEl } from 'layout';
import './index.scss';

import ImagesTab from './ImagesTab';
import UploadTab from './UploadTab';
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
  } = props;

  const [imgUrl, setImgUrl] = useState(defaultImage);

  const onSaveImage = () => {
    if (onSave) {
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
            <UploadTab imgUrl={imgUrl} setImgUrl={setImgUrl} />
          </Tab.Pane>
        )
      };
    } if (tab.name && Array.isArray(tab.images)) {
      return {
        menuItem: tab.name,
        render: () => (
          <Tab.Pane>
            <ImagesTab images={tab.images} imgUrl={imgUrl} setImgUrl={setImgUrl} />
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
      title="Choose Cover Image"
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
      images: PropTypes.arrayOf(PropTypes.string)
    })
  ])),

  /** callback on save the picked image (will pass in the picked image) */
  onSave: PropTypes.func,

  /** callback on close the modal */
  onClose: PropTypes.func,
};

export default ImagePickerModal;
