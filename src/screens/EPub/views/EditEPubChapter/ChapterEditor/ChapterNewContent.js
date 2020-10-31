import React, { useState } from 'react';
import { CTFragment } from 'layout';
import { ChapterEditButton, ImagePicker, MDEditorModal } from '../../../components';
import { EPubImageData } from 'entities/EPubs';

function ChapterNewContent({
  onInsert,
  screenshots,
  chapterScreenshots
}) {
  const [insertType, setInsertType] = useState(null);
  const openMDEditor = insertType === 'md';
  const openImgPicker = insertType === 'img';

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
  const handleOpenImgPicker = () => setInsertType('img');

  return (
    <CTFragment alignItCenter>
      <ChapterEditButton muted className="mr-1" onClick={handleOpenMDEditor}>
        Insert text
      </ChapterEditButton>

      <ChapterEditButton muted className="ml-1" onClick={handleOpenImgPicker}>
        Insert image
      </ChapterEditButton>

      <ImagePicker
        show={openImgPicker}
        onClose={handleClose}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
        onSave={handleSaveImage}
      />

      <MDEditorModal
        show={openMDEditor}
        onClose={handleClose}
        onSave={handleSave}
        title="Insert New Text"
      />
    </CTFragment>
  );
}

export default ChapterNewContent;
