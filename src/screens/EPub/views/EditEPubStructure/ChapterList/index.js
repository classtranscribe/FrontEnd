import React, { useEffect} from 'react';
import { epub } from '../../../controllers';
import { connect } from 'dva';
import EPubChapterItem from './EPubChapterItem';
import './index.scss';

function ChapterList({ chapters = [], foldedIds = [], setEPubItem }) {
  useEffect(() => {
    const currChIndex = epub.state.currChIndex;
    if (currChIndex > 0) {
      setTimeout(() => {
        epub.nav.navigateChapter(epub.data.data.chapters[currChIndex].id);
      }, 500);
    }
  }, []);

  return (
    <ul className="plain-ul ct-epb chapter-list">
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

export default connect(({ epub, loading }) => ({
  epub
}))(ChapterList);
