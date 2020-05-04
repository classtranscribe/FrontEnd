import React from 'react';

import ChapterTitle from './ChapterTitle/';
import ChapterImage from './ChapterImage';
import ChapterText from './ChapterText';


function ChapterInfo({
  chapter,
  screenshots,
}) {

  const { title, content, id, image } = chapter;

  const onChooseImage = newImage => {

  }

  const onSaveText = newText => {

  }

  return (
    <div className="ee-ech-ch-info">
      <ChapterTitle
        value={title}
        headingType="h2"
      />

      <ChapterImage
        image={image}
      />
      
      <ChapterText
        id={'epub-ch-txt-' + id}
        text={content}
        chapter={chapter}
        screenshots={screenshots}
        onSaveText={onSaveText}
        onChooseImage={onChooseImage}
      />
    </div>
  );
}

export default ChapterInfo;
