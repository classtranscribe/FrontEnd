import React from 'react';
import { epub } from 'screens/MediaSettings/Utils/epub';

import ChapterTitleButton from './ChapterTitleButton';
import EpubListItem from './EpubListItem';
import EpubSubChapterItem from './EpubSubChapterItem';

const classNames = require('classnames');

function EpubChapterItem({
  chapter,
  chapterIndex,
  foldedIds=[],
  canUndoSplit=false,
}) {

  const fold = () => epub.foldChapter(chapter.id);
  const unfold = () => epub.unfoldChapter(chapter.id);

  const undoSplitChapter = () => epub.undoSplitChapter(chapterIndex);
  const handleMouseOverChapterList = () => epub.handleMouseOverChapterList(chapter);

  const handleChapterTitleChange = ({ target: { value } }) => {
    epub.handleChapterTitleChange(chapterIndex, value);
  }

  const isFolded = foldedIds.includes(chapter.id);
  
  let chaperClass = classNames('ct-d-c ee-el-items', {
    fold: isFolded
  });

  return (
    <div 
      id={chapter.id}
      className={chaperClass}
      onMouseEnter={handleMouseOverChapterList}
    >
      <div className="ee-el-ch-title ct-d-r-center-v">
        <input contentEditable
          className="ct-div-editable"
          value={chapter.title}
          onChange={handleChapterTitleChange}
        />

        <ChapterTitleButton show
          content={isFolded ? 'Expand' : 'Collapse'}
          color="transparent"
          icon="expand_more"
          className="ee-el-expand-btn"
          outlined={false}
          onClick={isFolded ? unfold : fold}
        />

        <ChapterTitleButton 
          show={canUndoSplit}
          content="Undo split"
          icon="unfold_less"
          className="ee-el-ch-t-remove-btn"
          onClick={undoSplitChapter}
        />
      </div>

      {
        isFolded 
        ?
        <div className="ee-el-ch-compact-txt">
          <div>
            {epub.getCompactText(chapter)} ...
          </div>
        </div>
        :
        <>
        <div className="ct-d-c ee-el-i-ul">
          {chapter.items.map((item, itemIndex) => (
            <EpubListItem 
              key={item.id} 
              item={item} 
              itemIndex={itemIndex}
              chapterIndex={chapterIndex}
              canSplit={itemIndex > 0}
              canSubdivide
            />
          ))}
        </div>

        <div className="ct-d-c ee-el-i-ul">
          {chapter.subChapters.map((subChapter, subChapterIndex) => (
            <EpubSubChapterItem
              key={subChapter.id}
              subChapter={subChapter}
              foldedIds={foldedIds}
              chapterIndex={chapterIndex}
              subChapterIndex={subChapterIndex}
              canUndoSubdivide={subChapterIndex === 0}
              canUndoSplitSubChapter={subChapterIndex > 0}
              canSplitAsNewChapter={chapter.items.length > 0 || subChapterIndex > 0}
            />
          ))}
        </div>
        </>
      }

    </div>
  );
}

export default EpubChapterItem;