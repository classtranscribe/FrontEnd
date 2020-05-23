import React, { useEffect } from 'react';
import { util } from 'utils';
import { ScrollArea } from 'components/ScrollArea';
import { connectWithRedux } from 'screens/MediaSettings/Utils/epub';
import { MarkdownPreviewer } from '../../Markdown';
import './index.scss';

let lastChapterId = null;

function ChapterPreview({ currChapter }) {
  const { text } = currChapter;

  useEffect(() => {
    if (currChapter && currChapter.id !== lastChapterId) {
      util.elem.scrollToTop('msp-ee-sch-pview-con');
      lastChapterId = currChapter.id;
    }
  }, [currChapter]);

  return (
    <ScrollArea
      id="msp-ee-sch-pview-con"
      className="msp-ee-sch-pview-con"
      scrollClassName="msp-ee-sch-pview-scroll"
      scrollToTopButton="right top"
    >
      <MarkdownPreviewer value={text} className="ee-sch-pview" />
    </ScrollArea>
  );
}

export default connectWithRedux(ChapterPreview, ['currChapter']);
