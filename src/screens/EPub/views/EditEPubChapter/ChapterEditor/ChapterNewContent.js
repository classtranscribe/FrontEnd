import React, { useState } from 'react';
import { connect } from 'dva'
import { CTFragment } from 'layout';
import { EPubImageData } from 'entities/EPubs';
import { ChapterEditButton, MDEditorModal } from '../../../components';
import { epub } from '../../../controllers';

function ChapterNewContent({ onInsert, currChIndex, dispatch }) {
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
    handleSave(new EPubImageData(val));
  };

  const handleOpenMDEditor = () => setInsertType('md');
  const handleOpenImgPicker = () => {
    const epubData = epub.data.data;
    const imgData = {
      screenshots: epubData.images,
      onSave: handleSaveImage,
      chapterScreenshots: epubData.chapters[currChIndex].allImagesWithIn
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

export default connect(({ epub: { currChIndex }, loading }) => ({
  currChIndex
}))(ChapterNewContent);
