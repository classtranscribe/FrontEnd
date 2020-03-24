import React from 'react'
import _ from 'lodash'
import EpubListItem from './EpubListItem'
import { Button } from 'pico-ui'
import { Popup } from 'semantic-ui-react'

export default function EpubList({
  chapter,
  chapterIndex,
  splitChapter,
  undoSplitChapter,
  changeChapter,
  handleTitleChange,
  magnifyImage,
  endMagnifyImage,
  foldedIds=[],
  foldChapter,
  unfoldChapter,
}) {

  const fold = () => foldChapter(chapter.id)
  const unfold = () => unfoldChapter(chapter.id)

  const isFolded = foldedIds.includes(chapter.id)

  const getCompactText = () => {
    return _.map(chapter.items, item => item.text)
            .filter(txt => txt !== '')
            .join('. ')
            .slice(0, 200)
  }

  return (
    <div 
      id={chapter.id}
      className={"ct-d-c ee-el-items" + (isFolded ? ' fold' : '')}
      onMouseEnter={() => changeChapter(chapter)}
    >
      <div className="ee-el-ch-title ct-d-r-center-v">
        <input contentEditable
          className="ct-div-editable"
          value={chapter.title}
          onChange={({ target: { value } }) => handleTitleChange(chapterIndex, value)}
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
                onClick={() => undoSplitChapter(chapterIndex)}
              />
            </div>
          }
        />
      </div>

      {
        isFolded 
        ?
        <div className="ee-el-ch-compact-txt">
          <div>
            {getCompactText()} ...
          </div>
        </div>
        :
        <div className="ct-d-c ee-el-i-ul">
          {chapter.items.map((item, itemIndex) => (
            <EpubListItem 
              key={item.id} 
              item={item} 
              itemIndex={itemIndex}
              chapterIndex={chapterIndex}
              splitChapter={splitChapter}
              magnifyImage={magnifyImage}
              endMagnifyImage={endMagnifyImage}
            />
          ))}
        </div>
      }

    </div>
  )
}
