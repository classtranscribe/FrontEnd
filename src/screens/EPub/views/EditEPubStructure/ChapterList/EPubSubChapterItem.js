import React, { useEffect } from 'react';
import cx from 'classnames';
import { CTText } from 'layout';
import { epub, getCompactText } from '../../../controllers';
import { ChapterTitle } from '../../../components';
import ChapterTitleButton from './ChapterTitleButton';
import EPubListItem from './EPubListItem';

function EPubSubChapterItem({
  subChapter,
  foldedIds = [],
  chapterIndex,
  subChapterIndex,
  canUndoSubdivide = false,
  canUndoSplitSubChapter = false,
  canSplitAsNewChapter = false,
  setEPubItem,
  onFold,
  dispatch
}) {
  const undoSubdivideChapter = () => dispatch({
    type: 'epub/updateEpubData', payload: {
      action: 'undoSubdivideChapter', payload: { chapterIdx: chapterIndex }
    }
  });

  const undoSplitSubChapter = () =>
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'undoSplitSubChapter', payload: { chapterIdx: chapterIndex, subChapterIdx: subChapterIndex }
      }
    })

  const splitChapterFromSubChapter = () => dispatch({
    type: 'epub/updateEpubData', payload: {
      action: 'splitChapterFromSubChapter', payload: { chapterIdx: chapterIndex, subChapterIdx: subChapterIndex }
    }
  })

  const saveSubChapterTitle = value =>
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'saveSubChapterTitle', payload: { chapterIdx: chapterIndex, subChapterIdx: subChapterIndex, value }
      }
    })

  const isFolded = foldedIds.includes(subChapter.id);

  const schClasses = cx('ct-epb', 'sch', 'ch-item', 'sub', 'ct-d-c', {
    fold: isFolded
  });

  // Automatically update the untitle subchapter names to correlate with the subchapter index
  useEffect(() => {
    const reg = /^Untitled Sub-Chapter \(\d\)$/;
    if (reg.test(subChapter.title)) {
      saveSubChapterTitle(`Untitled Sub-Chapter (${subChapterIndex + 1})`)
    }
  }, [subChapterIndex]);

  return (
    <div id={epub.id.schID(subChapter.id)} className={schClasses}>
      <CTText muted className="pt-2 pl-2">
        Sub-Chapter {chapterIndex + 1}.{subChapterIndex + 1}: {subChapter.title}
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
          show
          content={isFolded ? 'Expand' : 'Collapse'}
          color="transparent"
          icon={isFolded ? "expand_more" : "expand_less"}
          className="ch-item-expand-btn"
          outlined={false}
          onClick={() => onFold(!isFolded, subChapter.id)}
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
          // color="black"
          icon="first_page"
          className="ch-item-act-btn padded-3"
          onClick={splitChapterFromSubChapter}
        />
      </div>

      {
        isFolded
          ?
            <CTText line={2} className="ch-item-compact-txt">
              {getCompactText(subChapter)}
            </CTText>
            :
            <div className="ch-item-ol ct-d-c">
              {subChapter?.items?.map((item, itemIndex) => (
                <EPubListItem
                  isSubChapter
                  key={item.id}
                  item={item}
                  itemIndex={itemIndex}
                  chapterIndex={chapterIndex}
                  subChapterIndex={subChapterIndex}
                  canSplit={itemIndex > 0}
                  canSplitSubChapter={itemIndex > 0}
                  setEPubItem={setEPubItem}
                />
              ))}
            </div>
      }
    </div>
  );
}

export default EPubSubChapterItem;
