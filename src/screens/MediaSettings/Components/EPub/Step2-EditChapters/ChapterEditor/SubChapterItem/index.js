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
  const { title, text, id, image, items } = subChapter;

  // let { content } = epub.parseText(text);

  return (
    <div className="ee-ech-subch">
      <ChapterTitle
        value={title}
        headingType="h3"
      />

      <ChapterImage
        image={image}
        screenshots={screenshots}
      />
      
      <ChapterText
        id={'epub-ch-txt-' + id}
        chapter={subChapter}
        text={text}
        screenshots={screenshots}
      />
    </div>
  );
}

export default SubChapterItem;
