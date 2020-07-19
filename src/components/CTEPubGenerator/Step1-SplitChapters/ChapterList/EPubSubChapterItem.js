import React from 'react';
import cx from 'classnames';
import { CTText } from 'layout';
import { epub, getCompactText } from '../../controllers';
import { ChapterTitle } from '../../components';
import ChapterTitleButton from './ChapterTitleButton';
import EPubListItem from './EPubListItem';

function EPubSubChapterItem({
  subChapter,
  foldedIds=[],
  chapterIndex,
  subChapterIndex,
  canUndoSubdivide=false,
  canUndoSplitSubChapter=false,
  canSplitAsNewChapter=false,
}) {
  const fold = () => epub.ctrl.foldChapter(subChapter.id);
  const unfold = () => epub.ctrl.unfoldChapter(subChapter.id);

  const undoSubdivideChapter = () =>
    epub.data.undoSubdivideChapter(chapterIndex);

  const undoSplitSubChapter = () =>
    epub.data.undoSplitSubChapter(chapterIndex, subChapterIndex);
  
  const splitChapterFromSubChapter = () =>
    epub.data.splitChapterFromSubChapter(chapterIndex, subChapterIndex);

  const saveSubChapterTitle = value => 
    epub.data.saveSubChapterTitle(chapterIndex, subChapterIndex, value);

  const isFolded = foldedIds.includes(subChapter.id);

  const schClasses = cx('ct-epb', 'sch', 'ch-item', 'sub', 'ct-d-c', {
    fold: isFolded
  });

  return (
    <div id={epub.const.schID(subChapter.id)} className={schClasses}>
      <div
        className="ch-item-title-con sub ct-d-r-center-v"
      >
        <ChapterTitle
          id={epub.const.schTitleID(subChapter.id)}
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
          onClick={isFolded ? unfold : fold}
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
            {subChapter.items.map((item, itemIndex) => (
              <EPubListItem
                isSubChapter
                key={item.id} 
                item={item} 
                itemIndex={itemIndex}
                chapterIndex={chapterIndex}
                subChapterIndex={subChapterIndex}
                canSplit={itemIndex > 0}
                canSplitSubChapter={itemIndex > 0}
              />
            ))}
          </div>
      }
    </div>
  );
}

export default EPubSubChapterItem;