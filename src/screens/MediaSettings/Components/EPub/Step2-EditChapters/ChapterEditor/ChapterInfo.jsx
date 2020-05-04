import React from 'react';

import ChapterTitle from './ChapterTitle/';
import ChapterText from './ChapterText';


function ChapterInfo({
  chapter,
}) {

  const { title, content, id } = chapter;

  return (
    <div className="ee-ech-ch-info">
      <ChapterTitle
        value={title}
        headingType="h2"
      />
      
      <ChapterText
        id={'epub-ch-txt-' + id}
        chapter={chapter}
        text={content}
      />
    </div>
  );
}

export default ChapterInfo;
