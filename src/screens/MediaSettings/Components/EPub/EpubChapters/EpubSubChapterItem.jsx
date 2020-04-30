import React from 'react';
import { Button } from 'pico-ui';
import { Popup } from 'semantic-ui-react';
import { epub } from 'screens/MediaSettings/Utils';

import EpubListItem from './EpubListItem';

const classNames = require('classnames');

function EpubSubChapterItem({
  subChapter,
  foldedIds=[],
  chapterIndex,
  subChapterIndex,
  canUndoSubdivide=false,
  canUndoSplitSubChapter=false,
}) {

  const fold = () => epub.foldChapter(subChapter.id);
  const unfold = () => epub.unfoldChapter(subChapter.id);

  const isFolded = foldedIds.includes(subChapter.id);

  let subChaperClass = classNames('ct-d-c ee-el-items ee-el-sub', {
    fold: isFolded
  });

  return (
    <div 
      id={subChapter.id}
      className={subChaperClass}
    >
      <div className="ee-el-ch-title ee-el-sub ct-d-r-center-v">
        <input contentEditable
          className="ct-div-editable"
          value={subChapter.title}
          onChange={({ target: { value } }) => null}
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
          canUndoSubdivide
          &&
          <Popup inverted basic
            openOnTriggerMouseEnter
            openOnTriggerFocus
            openOnTriggerClick={false}
            closeOnTriggerBlur
            content="Undo Subdivide"
            trigger={
              <div className="ee-el-ch-t-remove-btn">
                <Button round
                  //color="transparent"
                  icon="arrow_back"
                  onClick={() => epub.undoSubdivideChapter(chapterIndex)}
                />
              </div>
            }
          />
        }

        {
          canUndoSplitSubChapter
          &&
          <Popup inverted basic
            openOnTriggerMouseEnter
            openOnTriggerFocus
            openOnTriggerClick={false}
            closeOnTriggerBlur
            content="Append to Above Sub-Chapter"
            trigger={
              <div className="ee-el-ch-t-remove-btn">
                <Button round
                  //color="transparent"
                  icon="vertical_align_top"
                  onClick={() => epub.undoSplitSubChapter(chapterIndex, subChapterIndex)}
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
            {epub.getCompactText(subChapter)} ...
          </div>
        </div>
        :
        <div className="ct-d-c ee-el-i-ul">
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

export default EpubSubChapterItem;
