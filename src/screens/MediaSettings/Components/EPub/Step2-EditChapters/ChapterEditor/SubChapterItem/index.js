import React from 'react';
import { epub } from 'screens/MediaSettings/Utils/epub';

import ChapterTitle from '../ChapterTitle';
import ChapterImage from '../ChapterImage';
import ChapterText from '../ChapterText';

function SubChapterItem({
  subChapter,
  subChapterIndex,
  screenshots,
}) {
  const { title, text, id, image } = subChapter;

  const onSaveTitle = newTitle => {
    epub.saveSubChapterTitle(subChapterIndex, newTitle);
  }

  // let { content } = epub.parseText(text);
  const onChooseImage = newImage => {
    epub.saveSubChapterImage(subChapterIndex, newImage);
  }

  const onRemoveImage = () => {
    epub.removeSubChapterImage(subChapterIndex);
  }

  const onSaveText = newText => {
    epub.saveSubChapterText(subChapterIndex, newText)
  }

  return (
    <div className="ee-ech-subch">
      <ChapterTitle
        id={'epub-sub-ch-' + id}
        value={title}
        headingType="h3"
        onSave={onSaveTitle}
      />

      <ChapterImage
        id={'epub-sub-ch-img-' + id}
        image={image}
        screenshots={screenshots}
        onChooseImage={onChooseImage}
        onRemoveImage={onRemoveImage}
      />
      
      <ChapterText
        id={'epub-sub-ch-txt-' + id}
        chapter={subChapter}
        text={text}
        screenshots={screenshots}
        onSaveText={onSaveText}
        onChooseImage={onChooseImage}
      />
    </div>
  );
}

export default SubChapterItem;
