import React from 'react';
import { connect } from 'dva'
import { CTImagePickerModal } from 'components';

function ImagePickerModal({ imgPickerData, dispatch, epub, ...playerData }) {
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
    sourceType: epub.sourceType,
    sourceId: epub.sourceId,
    onClose: () => dispatch({ type: 'epub/setImgPickerData', payload: null }),
    ...imgPickerData,
    playerData
  };

  return (
    <CTImagePickerModal {...imgPickerProps} />
  );
}

export default connect(({ epub: { imgPickerData, media, epub }, loading }) => ({
  imgPickerData, media, epub
}))(ImagePickerModal);