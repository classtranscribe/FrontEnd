import React, { useEffect} from 'react';
import { connect } from 'dva';
import { epub as epubController } from '../../../controllers';
import EPubChapterItem from './EPubChapterItem';
import './index.scss';

function ChapterList({ chapters = [], foldedIds = [], setEPubItem }) {
  useEffect(() => {
    const currChIndex = epubController.state.currChIndex;
    if (currChIndex > 0) {
      setTimeout(() => {
        epubController.nav.navigateChapter(epubController.data.data.chapters[currChIndex].id);
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
