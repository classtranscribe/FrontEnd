import React from 'react';
import { connect } from 'dva'
import { CTImagePickerModal } from 'components';
import { epub } from '../controllers';

function ImagePickerModal({ imgPickerData, dispatch, ...playerData }) {
  const show = Boolean(imgPickerData);
  if(!show) {
    return null;
  }
  const { screenshots = [], chapterScreenshots = [] } = imgPickerData;

  let tabs = [
    {
      name: 'All Screenshots',
      images: screenshots,
      description: 'All auto-captured screenshots for this video.'
    },
    'upload',
    'video'
  ];

  if (chapterScreenshots.length > 0) {
    tabs = [{
      name: 'Chapter Screenshots',
      images: chapterScreenshots,
      description: 'Auto-captured screenshots for current chapter.'
    }, ...tabs];
  }

  const imgPickerProps = {
    show,
    tabs,
    sourceType: epub.data.data.sourceType,
    sourceId: epub.data.data.sourceId,
    onClose: () => dispatch({ type: 'epub/setImgPickerData', payload: null }),
    ...imgPickerData,
    playerData
  };

  return (
    <CTImagePickerModal {...imgPickerProps} />
  );
}

export default connect(({ epub: { imgPickerData, media }, loading }) => ({
  imgPickerData, media
}))(ImagePickerModal);