import React, { useEffect } from 'react';
import { connect } from 'dva';
import EPubChapterItem from './EPubChapterItem';
import './index.scss';

function ChapterList({ chapters = [], foldedIds = [], currChIndex, setEPubItem, dispatch }) {
  useEffect(() => {
    if (currChIndex > 0) {
      setTimeout(() => {
        dispatch({ type: 'epub/navigateChapter', payload: chapters[currChIndex].id });
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
          dispatch={dispatch}
        />
      ))}
    </ul>
  );
}

export default connect(({ epub: { currChIndex, epub: { chapters }, foldedIds }, loading }) => ({
  currChIndex, chapters, foldedIds
}))(ChapterList);
