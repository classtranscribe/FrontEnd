import React from 'react';
import { epub } from 'screens/MediaSettings/Utils/epub';

import ChapterTitle from './ChapterTitle';
import ChapterImage from './ChapterImage';
import ChapterText from './ChapterText';


function ChapterInfo({
  chapter,
  screenshots,
  chapterScreenshots,
}) {
  const { title, content, id, image } = chapter;

  const onSaveTitle = newTitle => {
    epub.ech.saveChapterTitle(id, newTitle);
  }

  const onChooseImage = newImage => {
    epub.ech.saveChapterImage(id, newImage);
  }

  const onRemoveImage = () => {
    epub.removeChapterImage(id);
  }

  const onSaveText = newText => {
    epub.ech.saveChapterText(id, newText)
  }

  return (
    <div className="ee-ech-ch-info">
      <ChapterTitle
        id={`epub-ch-${ id}`}
        value={title}
        headingType="h2"
        onSave={onSaveTitle}
        label="Chapter Title"
        placeholder="Chapter Title"
      />

      <ChapterImage
        id={`epub-ch-img-${ id}`}
        image={image}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
        onChooseImage={onChooseImage}
        onRemoveImage={onRemoveImage}
      />
      
      <ChapterText
        id={`epub-ch-txt-${ id}`}
        text={content}
        chapter={chapter}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
        onSaveText={onSaveText}
        onChooseImage={onChooseImage}
      />
    </div>
  );
}

export default ChapterInfo;
