import React, { useState } from 'react';
import { connect } from 'dva'
import { CTFragment } from 'layout';
import { EPubImageData } from 'entities/EPubs';
import { ChapterEditButton, MDEditorModal } from '../../../components';

function ChapterNewContent({ onInsert, currChIndex, images, epub, dispatch }) {
  const [insertType, setInsertType] = useState(null);
  const openMDEditor = insertType === 'md';

  const handleClose = () => setInsertType(null);

  const handleSave = (val) => {
    if (typeof onInsert === 'function' && val) {
      onInsert(val);
    }

    handleClose();
  };

  const handleSaveImage = (val) => {
    handleSave(new EPubImageData(val).toObject());
  };

  const handleOpenMDEditor = () => setInsertType('md');
  const handleOpenImgPicker = () => {
    const imgData = {
      screenshots: images,
      onSave: handleSaveImage,
      chapterScreenshots: epub.chapters[currChIndex].allImagesWithIn
    };
    dispatch({ type: 'epub/setImgPickerData', payload: imgData });
  }

  return (
    <CTFragment alignItCenter>
      <ChapterEditButton muted className="mr-1" onClick={handleOpenMDEditor}>
        Insert text
      </ChapterEditButton>

      <ChapterEditButton muted className="ml-1" onClick={handleOpenImgPicker}>
        Insert image
      </ChapterEditButton>

      <MDEditorModal
        show={openMDEditor}
        onClose={handleClose}
        onSave={handleSave}
        title="Insert New Text"
      />
    </CTFragment>
  );
}

export default connect(({ epub: { currChIndex, epub, images }, loading }) => ({
  currChIndex, images, epub
}))(ChapterNewContent);
