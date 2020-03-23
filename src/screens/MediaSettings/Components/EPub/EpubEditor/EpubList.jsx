import React from 'react'
import EpubListItem from './EpubListItem'
import { Button } from 'pico-ui'
import { Popup } from 'semantic-ui-react'
import { util } from 'utils'

export default function EpubList({
  chapters=[],
  splitChapter,
  undoSplitChapter,
  changeChapter,
  handleTitleChange,
}) {

  return (
    <div className="msp-ee-el-con ct-d-c">
      <div className="msp-ee-el-header">
        <h1>Manage Your ePub Book</h1>
        <p>
          <span className="msp-ee-el-h-p-t">Instruction</span>
          To manage your ePub chapters, set <span>splitting points</span> between screenshots to generate an initial version of ePub chapters. 
          To change <span>cover images</span>, click the image of the ePub preview on the left.
          <br/>
          After everything is done, hit <span>'Save ePub' button</span> to see the preview of your ePub file. You can also edit the ePub contents there.
        </p>
      </div>

      <div className="ct-d-c ee-el-chapters">
        {chapters.map((chapter, chapterIndex) => (
          <div 
            id={chapter.id}
            key={`ee-el-ch-${chapterIndex}`} 
            className="ct-d-c ee-el-items"
            onMouseEnter={() => changeChapter(chapter)}
          >
            <div className="ee-el-ch-title">
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
                content="Undo split"
                trigger={
                  <div className="ee-el-ch-t-remove-btn">
                    <Button round
                      color="transparent"
                      icon="unfold_less"
                      onClick={() => undoSplitChapter(chapterIndex)}
                    />
                  </div>
                }
              />
            </div>

            {
              chapter.items.map((item, itemIndex) => (
                <EpubListItem 
                  key={item.id} 
                  item={item} 
                  itemIndex={itemIndex}
                  chapterIndex={chapterIndex}
                  splitChapter={splitChapter}
                />
              ))
            }

          </div>
        ))}
      </div>
    </div>
  )
}
