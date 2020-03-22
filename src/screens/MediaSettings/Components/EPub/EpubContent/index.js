import React, { useState, useEffect } from 'react'
import { Button } from 'pico-ui'
import { PlaceHolder } from '../../../../../components'
import { /* UserTipsForEditing, */ UserTipsForCombining } from './UserTips'
import { util } from '../../../../../utils'
import { epub } from '../../../Utils'
import _ from 'lodash'
import './index.scss'

import ChapterView from '../ChapterView'

function EpubContent({
  currChapter,
  handleChapterClick,
}) {

  const { id, title } = currChapter
  let titleToSave = title
  const [isEditing, setIsEditing] = useState(false)

  const onEdit = (type, value) => {
    if (type === 'title') {
      titleToSave = value
    } else {
      epub.text(value)
    }
    if (!isEditing) setIsEditing(true)
  }

  const onSave = () => {
    epub.saveTextEdit(id, titleToSave)
    setIsEditing(false)
  }

  const onCancel = () => {
    handleChapterClick({})()
    setTimeout(() => {
      handleChapterClick(currChapter)()
    }, 300);
  }

  useEffect(() => {
    if (isEditing) {
      setIsEditing(false)
    }
    util.scrollToTop('#msp-e-view')
  }, [currChapter])

  return Boolean(title) 
  ? 
  (
    <div className="msp-e-view-con">
      <div id="msp-e-view" className="msp-e-view-box" data-scroll>

        {/* <div className="msp-e-v-instructions">
          <UserTipsForEditing />
        </div> */}
        
        <ChapterView contentEditable
          onEdit={onEdit}
          chapter={currChapter}
        />
      </div>



      {/* Button Bar */}
      <div className={"msp-e-v-btns" + (isEditing ? " edit" : "")}>
        {
          isEditing
          ?
          <>
            <Button.Group>
              <Button uppercase
                text="save changes"
                color="teal"
                onClick={onSave}
              />
              <Button uppercase
                text="discard changes"
                color="teal transparent"
                onClick={onCancel}
              />
            </Button.Group>
          </>
          :
          <>
            <Button.Group>
              <Button uppercase
                text="combine to previous"
                color="teal transparent"
                onClick={null}
              />
              <UserTipsForCombining />
            </Button.Group>
            <Button.Group>
              <Button uppercase
                text="combine to next"
                color="teal transparent"
                onClick={null}
              />
            </Button.Group>
          </>
        }
      </div>
    </div>
  ) 
  : 
  <PlaceHolder />
}

export default EpubContent