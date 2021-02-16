import React from 'react';
import { CTFragment, CTText } from 'layout';
import { connect } from 'dva'
import ChapterInfo from './ChapterInfo';
import SubChapterItem from './SubChapterItem';
import './index.scss';

function ChapterEditor({ chapters = [], currChIndex, dispatch }) {
  const currChapter = chapters[currChIndex] || {};
  const { subChapters = [], title = '' } = currChapter;
  const onFold = (folded, id) => {
    dispatch({ type: 'epub/foldChapter', payload: { id, folded } })
  }
  return (
    <CTFragment className="ct-epb ech ch-con" shadowed>
      <CTText muted className="pl-1">Chapter {currChIndex + 1}: {title}</CTText>
      <ChapterInfo chapter={currChapter} currChIndex={currChIndex} dispatch={dispatch} />

      <CTFragment dFlexCol role="list">
        {subChapters.map((subChapter, subChapterIndex) => (
          <SubChapterItem
            currChIndex={currChIndex}
            onFold={onFold}
            key={`ee-ech-${subChapter.id}`}
            subChapter={subChapter}
            subChapterIndex={subChapterIndex}
            dispatch={dispatch}
          />
        ))}
      </CTFragment>
    </CTFragment>
  );
}

export default connect(({ epub: { epub: { chapters }, currChIndex }, loading }) => ({
  chapters, currChIndex
}))(ChapterEditor);