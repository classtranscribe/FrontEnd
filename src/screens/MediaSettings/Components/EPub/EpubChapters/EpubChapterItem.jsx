import React from 'react';
import _ from 'lodash';
import { Button } from 'pico-ui';
import { Popup } from 'semantic-ui-react';
import { epub } from 'screens/MediaSettings/Utils';

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

  const isFolded = foldedIds.includes(chapter.id);
  
  let chaperClass = classNames('ct-d-c ee-el-items', {
    fold: isFolded
  });

  return (
    <div 
      id={chapter.id}
      className={chaperClass}
      onMouseEnter={() => epub.handleMouseOverChapterList(chapter)}
    >
      <div className="ee-el-ch-title ct-d-r-center-v">
        <input contentEditable
          className="ct-div-editable"
          value={chapter.title}
          onChange={({ target: { value } }) => epub.handleTitleChange(chapterIndex, value)}
        />
        
        <Popup inverted basic
          openOnTriggerMouseEnter
          openOnTriggerFocus
          openOnTriggerClick={false}
          closeOnTriggerBlur
          content={isFolded ? 'Expand' : 'Collapse'}
          trigger={
            <div>
              <Button round
                color="transparent"
                classNames="ee-el-expand-btn"
                icon="expand_more"
                onClick={isFolded ? unfold : fold}
              />
            </div>
          }
        />

        {
          canUndoSplit
          &&
          <Popup inverted basic
            openOnTriggerMouseEnter
            openOnTriggerFocus
            openOnTriggerClick={false}
            closeOnTriggerBlur
            content="Undo split"
            trigger={
              <div className="ee-el-ch-t-remove-btn">
                <Button round
                  //color="transparent"
                  icon="unfold_less"
                  onClick={() => epub.undoSplitChapter(chapterIndex)}
                />
              </div>
            }
          />
        }
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
            />
          ))}
        </div>
        </>
      }

    </div>
  );
}

export default EpubChapterItem;