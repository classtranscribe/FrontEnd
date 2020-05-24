import React from 'react';
import { epub } from 'screens/MediaSettings/controllers/epub';

import ChapterTitleButton from './ChapterTitleButton';
import EpubListItem from './EpubListItem';
import ChapterTitle from '../../Step2-EditChapters/ChapterEditor/ChapterTitle';

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
  const fold = () => epub.sch.foldChapter(subChapter.id);
  const unfold = () => epub.sch.unfoldChapter(subChapter.id);

  const undoSubdivideChapter = () => {
    epub.sch.undoSubdivideChapter(chapterIndex);
  };

  const undoSplitSubChapter = () => {
    epub.sch.undoSplitSubChapter(chapterIndex, subChapterIndex);
  };
  
  const splitChapterFromSubChapter = () => {
    epub.sch.splitChapterFromSubChapter(chapterIndex, subChapterIndex);
  };

  const handleSubChapterTitleChange = value => {
    epub.sch.handleSubChapterTitleChange(chapterIndex, subChapterIndex, value);
  }

  const isFolded = foldedIds.includes(subChapter.id);

  let subChaperClass = classNames('ct-d-c ee-sch-items ee-sch-sub', {
    fold: isFolded
  });

  return (
    <div id={subChapter.id} className={subChaperClass}>
      <div 
        className="ee-sch-ch-title-con ee-sch-sub ct-d-r-center-v"
      >
        <ChapterTitle
          id={`sch-subch-${ subChapter.id}`}
          value={subChapter.title}
          headingType="h3"
          onSave={handleSubChapterTitleChange}
          className="ee-sch-ch-title"
        />

        <ChapterTitleButton
          show
          content={isFolded ? 'Expand' : 'Collapse'}
          color="transparent"
          icon={isFolded ? "expand_more" : "expand_less"}
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
          content="As a new Chapter"
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
              <EpubListItem
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
