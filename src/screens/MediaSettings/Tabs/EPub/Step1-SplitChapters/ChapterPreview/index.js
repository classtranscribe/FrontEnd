import React from 'react';
import { connectWithRedux } from 'screens/MediaSettings/Utils/epub';
import { MarkdownPreviewer } from '../../Markdown';
import './index.scss';


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
