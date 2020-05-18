import React, { useEffect } from 'react';
import { connectWithRedux } from 'screens/MediaSettings/Utils/epub';
import { MarkdownPreviewer } from '../../Markdown';
import './index.scss';
import { util } from 'utils';

var lastChapterId = null;


function ChapterPreview({
  currChapter
}) {
  let { text } = currChapter;

  useEffect(() => {
    if (currChapter && currChapter.id !== lastChapterId) {
      util.elem.scrollToTop('msp-ee-sch-pview-con');
      lastChapterId = currChapter.id;
    }
  }, [currChapter]);

  return (
    <div id="msp-ee-sch-pview-con" className="msp-ee-sch-pview-con" data-scroll>
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
