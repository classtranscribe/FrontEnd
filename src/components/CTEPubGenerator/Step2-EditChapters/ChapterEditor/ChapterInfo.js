import React from 'react';
import { CTFragment } from 'layout';
import { epub } from '../../controllers';
import { ChapterTitle, ChapterImage, ChapterText } from '../../components';

function ChapterInfo({
  chapter,
  screenshots,
  chapterScreenshots,
}) {
  const { title, text, id, image } = chapter;

  const onSaveTitle = newTitle =>
    epub.data.saveChapterTitle(epub.state.currChIndex, newTitle);

  const onChooseImage = newImage => epub.data.saveCurrChapterImage(newImage);

  const onRemoveImage = () => epub.data.removeCurrChapterImage();
  
  const onSaveText = newText => epub.data.saveCurrChapterText(newText);

  return (
    <CTFragment list>
      <ChapterTitle
        id={epub.const.chTitleID(id)}
        value={title}
        headingType="h2"
        onSave={onSaveTitle}
        label="Chapter Title"
        placeholder="Chapter Title"
        bordered
      />

      <ChapterImage
        id={epub.const.chImgID(id)}
        image={image}
        imageAlt={title}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
        onChooseImage={onChooseImage}
        onRemoveImage={onRemoveImage}
      />
      
      <ChapterText
        id={epub.const.chTextID(id)}
        text={text}
        chapter={chapter}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
        onSaveText={onSaveText}
        onChooseImage={onChooseImage}
      />
    </CTFragment>
  );
}

export default ChapterInfo;
