import React from 'react';
import { epub, connectWithRedux } from '../../../controllers';
import EPubChapterItem from './EPubChapterItem';
import './index.scss';

function ChapterList({ chapters = [], foldedIds = [], setEPubItem }) {
  return (
    <ul className="plain-ul" id={epub.id.EPubChapterListID}>
      {chapters.map((chapter, chIdx) => (
        <EPubChapterItem
          key={chapter.id}
          chapter={chapter}
          canDisplayFull
          chapterIndex={chIdx}
          canUndoSplit={chIdx > 0}
          foldedIds={foldedIds}
          setEPubItem={setEPubItem}
        />
      ))}
    </ul>
  );
}

export default connectWithRedux(
  ChapterList,
  ['chapters', 'foldedIds']
);
