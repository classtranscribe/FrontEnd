import React, { useEffect } from 'react';
import cx from 'classnames';
import { CTText } from 'layout';
import { epub, getCompactText } from '../../../controllers';
import { ChapterTitle } from '../../../components';
import ChapterTitleButton from '../../EditEPubStructure/ChapterList/ChapterTitleButton';
import INoteButtons from './INoteButtons';

function INoteSubChapter({
    subChapter,
    chIdx,
    subChapterIdx,
    canUndoSubdivide = false,
    canUndoSplitSubChapter = false,
    canSplitAsNewChapter = false,
    dispatch
}) {
  const undoSubdivideChapter = () => dispatch({
    type: 'epub/updateEpubData', payload: {
      action: 'undoSubdivideChapter', payload: { chapterIdx: chIdx }
    }
  });

  const undoSplitSubChapter = () =>
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'undoSplitSubChapter', payload: { chapterIdx: chIdx, subChapterIdx: subChapterIdx }
      }
    })

  const splitChapterFromSubChapter = () => dispatch({
    type: 'epub/updateEpubData', payload: {
      action: 'splitChapterFromSubChapter', payload: { chapterIdx: chIdx, subChapterIdx: subChapterIdx }
    }
  })

  const saveSubChapterTitle = value =>
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'saveSubChapterTitle', payload: { chapterIdx: chIdx, subChapterIdx: subChapterIdx, value }
      }
    })

  const schClasses = cx('ct-epb', 'sch', 'ch-item', 'sub', 'ct-d-c');

  // Automatically update the untitle subchapter names to correlate with the subchapter index
  useEffect(() => {
    const reg = /^Untitled Sub-Chapter \(\d\)$/;
    if (reg.test(subChapter.title)) {
      saveSubChapterTitle(`Untitled Sub-Chapter (${subChapterIdx + 1})`)
    }
  }, [subChapterIdx]);

  return (
    <div id={epub.id.schID(subChapter.id)} className={schClasses}>
      <CTText muted className="pt-2 pl-2">
        Sub-Chapter {chIdx + 1}.{subChapterIdx + 1}: {subChapter.title}
      </CTText>
      <div
        className="ch-item-title-con sub ct-d-r-center-v"
      >
        <ChapterTitle
          id={epub.id.schTitleID(subChapter.id)}
          value={subChapter.title}
          headingType="h3"
          onSave={saveSubChapterTitle}
          className="ch-item-title"
        />

        <ChapterTitleButton
          show={canUndoSubdivide}
          content="Undo Subdivide"
          icon="chevron_left"
          className="ch-item-act-btn padded-2"
          onClick={undoSubdivideChapter}
        />

        <ChapterTitleButton
          show={canUndoSplitSubChapter}
          content="Append to Above Sub-Chapter"
          icon="vertical_align_top"
          className="ch-item-act-btn padded-2"
          onClick={undoSplitSubChapter}
        />

        <ChapterTitleButton
          show={canSplitAsNewChapter}
          content="As a new Chapter"
          icon="first_page"
          className="ch-item-act-btn padded-3"
          onClick={splitChapterFromSubChapter}
        />
      </div>

      {
        <div className="ch-item-ol ct-d-c">
            {subChapter?.items?.map((item, itemIdx) => (
                <INoteButtons
                    isSubChapter
                    key={item.id}
                    item={item}
                    itemIdx={itemIdx}
                    chIdx={chIdx}
                    subChapterIdx={subChapterIdx}
                    canSplit={itemIdx > 0}
                    canSplitSubChapter={itemIdx > 0}
                />
            ))}
        </div>
      }
    </div>
  );
}

export default INoteSubChapter;
