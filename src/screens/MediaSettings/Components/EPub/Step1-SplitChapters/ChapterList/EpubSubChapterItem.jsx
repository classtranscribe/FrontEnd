import React from 'react';
import { epub } from 'screens/MediaSettings/Utils/epub';

import ChapterTitleButton from './ChapterTitleButton';
import EpubListItem from './EpubListItem';

const classNames = require('classnames');

export default function EpubSubChapterItem({
  subChapter,
  foldedIds=[],
  chapterIndex,
  subChapterIndex,
  canUndoSubdivide=false,
  canUndoSplitSubChapter=false,
  canSplitAsNewChapter=false,
}) {

  const fold = () => epub.foldChapter(subChapter.id);
  const unfold = () => epub.unfoldChapter(subChapter.id);

  const undoSubdivideChapter = () => epub.undoSubdivideChapter(chapterIndex);
  const undoSplitSubChapter = () => epub.undoSplitSubChapter(chapterIndex, subChapterIndex);
  const splitChapterFromSubChapter = () => epub.splitChapterFromSubChapter(chapterIndex, subChapterIndex);

  const handleSubChapterTitleChange = ({target: { value }}) => {
    epub.handleSubChapterTitleChange(chapterIndex, subChapterIndex, value);
  }

  const isFolded = foldedIds.includes(subChapter.id);

  let subChaperClass = classNames('ct-d-c ee-sch-items ee-sch-sub', {
    fold: isFolded
  });

  return (
    <div id={subChapter.id} className={subChaperClass}>
      <div 
        className="ee-sch-ch-title ee-sch-sub ct-d-r-center-v"
      >
        <input contentEditable
          className="ct-div-editable"
          value={subChapter.title}
          onChange={handleSubChapterTitleChange}
        />

        <ChapterTitleButton show
          content={isFolded ? 'Expand' : 'Collapse'}
          color="transparent"
          icon="expand_more"
          className="ee-sch-expand-btn"
          outlined={false}
          onClick={isFolded ? unfold : fold}
        />

        <ChapterTitleButton 
          show={canUndoSubdivide}
          content="Undo Subdivide"
          icon="chevron_left"
          className="ee-sch-ch-t-remove-btn ee-sch-sub-1"
          onClick={undoSubdivideChapter}
        />

        <ChapterTitleButton 
          show={canUndoSplitSubChapter}
          content="Append to Above Sub-Chapter"
          icon="vertical_align_top"
          className="ee-sch-ch-t-remove-btn ee-sch-sub-1"
          onClick={undoSplitSubChapter}
        />

        <ChapterTitleButton
          show={canSplitAsNewChapter}
          content="As new Chapter"
          // color="black"
          icon="first_page"
          className="ee-sch-ch-t-remove-btn ee-sch-sub-2"
          onClick={splitChapterFromSubChapter}
        />
      </div>

      {
        isFolded 
        ?
        <div className="ee-sch-ch-compact-txt">
          <div>
            {epub.getCompactText(subChapter)} ...
          </div>
        </div>
        :
        <div className="ct-d-c ee-sch-i-ul">
          {subChapter.items.map((item, itemIndex) => (
            <EpubListItem isSubChapter
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
