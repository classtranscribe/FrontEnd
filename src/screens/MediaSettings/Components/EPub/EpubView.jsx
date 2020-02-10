import React, { useState, useEffect } from 'react'
import { PlaceHolder, InfoIcon } from '../../../Instructor/Components'
import { Button } from 'pico-ui'
import { api } from 'utils'
import { util } from 'utils'

function EpubView({
  currChapter,
}) {

  const [isEditing, setIsEditing] = useState(false)
  const onInput = e => {
    setIsEditing(true)
  }

  const onSave = () => {
    setIsEditing(false)
  }

  useEffect(() => {
    if (isEditing) setIsEditing(false)
    util.scrollToTop('#msp-e-view')
  }, [currChapter])

  return Boolean(currChapter.title) 
  ? 
  (
    <div className="msp-e-view-con">
      <div id="msp-e-view" className="msp-e-view-box" data-scroll>
        <div className="msp-e-view">
          <div className="w-100">
            <h2>{currChapter.title || "Chapter"}</h2>
          </div>
          <img src={api.getMediaFullPath(currChapter.image)} />
          
          <div 
            className="msp-e-v-text"
            contentEditable={true}
            dangerouslySetInnerHTML={{ __html: currChapter.text }} 
            onInput={onInput}
          />
        </div>
      </div>

      <div className={"msp-e-v-btns" + (isEditing ? " edit" : "")}>
        {
          isEditing
          ?
          <Button.Group>
            <Button uppercase
              text="save changes"
              color="teal"
              onClick={onSave}
            />
            {/* <Button
              text="CANCEL"
            /> */}
          </Button.Group>
          :
          <>
            <Button.Group>
              <Button uppercase
                text="combine to previous"
                color="teal transparent"
                onClick={null}
              />
              <InfoIcon
                header="Combing Texts"
                content="After combining, the text of this chapter will be added to the previous/next chapter, while the image will be discarded."
              />
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

export default EpubView