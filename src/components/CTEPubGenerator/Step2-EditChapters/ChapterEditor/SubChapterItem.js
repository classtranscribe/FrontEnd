import React from 'react';
import { CTFragment } from 'layout';
import { epub } from '../../controllers';
import { ChapterTitle, ChapterImage, ChapterText } from '../../components';

function SubChapterItem({
  subChapter,
  subChapterIndex,
  screenshots,
  chapterScreenshots
}) {
  const { title, text, id, image } = subChapter;

  const onSaveTitle = (newTitle) =>
    epub.data.saveSubChapterTitle(epub.state.currChIndex, subChapterIndex, newTitle);

  const onChooseImage = (newImage) => 
    epub.data.saveSubChapterImage(subChapterIndex, newImage);

  const onRemoveImage = () => epub.data.removeSubChapterImage(subChapterIndex);

  const onSaveText = (newText) => epub.data.saveSubChapterText(subChapterIndex, newText);
  
  return (
    <CTFragment id={epub.const.schID(id)}>
      <ChapterTitle
        id={epub.const.schTitleID(id)}
        value={title}
        headingType="h3"
        onSave={onSaveTitle}
        label="Sub-Chapter Title"
        placeholder="Sub-Chapter Title"
      />

      <ChapterImage
        id={epub.const.schImgID(id)}
        image={image}
        imageAlt={title}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
        onChooseImage={onChooseImage}
        onRemoveImage={onRemoveImage}
      />

      <ChapterText
        id={epub.const.schTextID(id)}
        chapter={subChapter}
        text={text}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
        onSaveText={onSaveText}
        onChooseImage={onChooseImage}
      />
    </CTFragment>
  );
}

export default SubChapterItem;