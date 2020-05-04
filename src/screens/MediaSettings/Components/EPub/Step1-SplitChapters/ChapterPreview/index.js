import React from 'react';

import { MarkdownPreviewer } from '../../Markdown';
import './index.scss';

import { epub, connectWithRedux } from 'screens/MediaSettings/Utils/epub';


function ChapterPreview({
  currChapter
}) {
  let { text } = currChapter;

  return (
    <div className="msp-ee-sch-pview-con" data-scroll>
      <MarkdownPreviewer
        value={text}
        className="ee-sch-pview"
      />
    </div>
  );
}

export default connectWithRedux(
  ChapterPreview,
  ['currChapter']
);
