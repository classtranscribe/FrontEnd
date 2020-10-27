import React from 'react';
import { CTFragment } from 'layout';
import { ChapterImage, ChapterText } from '../../../components';
import ChapterNewContent from './ChapterNewContent';

function ChapterContent({
  id,
  content,
  screenshots,
  chapterScreenshots,
  onRemove,
  onTextChange,
  onImageChange,
  onInsert,
}) {
  const isTextContent = typeof content === 'string';

  return (
    <CTFragment>
      <ChapterNewContent 
        onInsert={onInsert}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
      />

      {
        isTextContent ? (
          <ChapterText 
            id={id}
            text={content}
            onSaveText={onTextChange}
          />
        ) : (
          <ChapterImage
            id={id}
            image={content}
            screenshots={screenshots}
            chapterScreenshots={chapterScreenshots}
            onChooseImage={onImageChange}
            onRemoveImage={onRemove}
          />
        )
      }
    </CTFragment>
  );
}

export default ChapterContent;
