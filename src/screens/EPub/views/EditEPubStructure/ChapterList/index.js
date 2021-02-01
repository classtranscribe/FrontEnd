import React, { useEffect } from 'react';
import { connect } from 'dva';
import { epub as epubController } from '../../../controllers';
import EPubChapterItem from './EPubChapterItem';
import './index.scss';

function ChapterList({ chapters = [], foldedIds = [], currChIndex, setEPubItem, dispatch }) {
  useEffect(() => {
    if (currChIndex > 0) {
      setTimeout(() => {
        dispatch({ type: 'epub/navigateChapter', payload: epubController.data.data.chapters[currChIndex].id });
      }, 500);
    }
  }, []);
  const onFold = (folded, id) => {
    dispatch({ type: 'epub/foldChapter', payload: { id, folded } })
  }
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
          onFold={onFold}
        />
      ))}
    </ul>
  );
}

export default connect(({ epub: { currChIndex, chapters, foldedIds }, loading }) => ({
  currChIndex, chapters, foldedIds
}))(ChapterList);
