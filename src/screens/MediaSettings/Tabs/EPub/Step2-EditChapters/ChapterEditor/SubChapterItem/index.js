import React from 'react';
import { epub } from 'screens/MediaSettings/Utils/epub';

import ChapterTitle from '../ChapterTitle';
import ChapterImage from '../ChapterImage';
import ChapterText from '../ChapterText';

function SubChapterItem({ subChapter, subChapterIndex, screenshots, chapterScreenshots }) {
  const { title, text, id, image } = subChapter;

  const onSaveTitle = (newTitle) => {
    epub.ech.saveSubChapterTitle(subChapterIndex, newTitle);
  };

  // let { content } = epub.parseText(text);
  const onChooseImage = (newImage) => {
    epub.ech.saveSubChapterImage(subChapterIndex, newImage);
  };

  const onRemoveImage = () => {
    epub.ech.removeSubChapterImage(subChapterIndex);
  };

  const onSaveText = (newText) => {
    epub.ech.saveSubChapterText(subChapterIndex, newText);
  };

  return (
    <div className="ee-ech-subch">
      <ChapterTitle
        id={`epub-sub-ch-${id}`}
        value={title}
        headingType="h3"
        onSave={onSaveTitle}
        label="Sub-Chapter Title"
        placeholder="Sub-Chapter Title"
      />

      <ChapterImage
        id={`epub-sub-ch-img-${id}`}
        image={image}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
        onChooseImage={onChooseImage}
        onRemoveImage={onRemoveImage}
      />

      <ChapterText
        id={`epub-sub-ch-txt-${id}`}
        chapter={subChapter}
        text={text}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
        onSaveText={onSaveText}
        onChooseImage={onChooseImage}
      />
    </div>
  );
}

export default SubChapterItem;
