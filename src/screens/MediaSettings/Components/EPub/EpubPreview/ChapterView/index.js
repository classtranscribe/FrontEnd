import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { Button } from 'pico-ui'

import EpubEditor from '../EpubEditor'
import './index.scss'

import { api } from 'utils'
import { epub } from 'screens/MediaSettings/Utils'

const ChapterView = ({
  txtEditor,
  adEditor,
  chapter,
  shadow=false,
  round=false,
  contentEditable=false,
  imageOnClick,
  imageOnClickPrompt,
}) => {
  const { text, image, title='', id, audioDescription } = chapter

  const [titleInput, setTitleInput] = useState(title)

  const handleTitleInput = e => {
    setTitleInput(e.target.value)
  }

  const handleTitleKeyDown = ({ keyCode, target }) => {
    if (keyCode === 13) {
      saveTitle()
      target.blur()
    }
  }

  const saveTitle = () => {
    let chapterIndex = _.findIndex(epub.chapters, { id })
    epub.handleTitleChange(chapterIndex, titleInput)
  }

  useEffect(() => {
    setTitleInput(title)
  }, [title])

  const isEditingTitle = titleInput !== title
  const style = "msp-e-view ct-a-fade-in" 
              + (shadow ? " shadow" : "") 
              + (round ? " round" : "")

  return image ? (
    <div className={style}>
      <div className="msp-e-v-title">
        <input
          readOnly={!contentEditable}
          onChange={handleTitleInput}
          value={titleInput}
          onKeyDown={handleTitleKeyDown}
        />
        {
          isEditingTitle
          &&
          <Button plain 
            classNames="ct-a-fade-in"
            size="big"
            text="SAVE"
            color="teal"
            onClick={saveTitle}
          />
        }
      </div>
      <div className="msp-e-v-img-con">
        <img src={api.getMediaFullPath(image)} />

        {
          imageOnClick 
          && 
          <div 
            tabIndex="0" 
            className="msp-e-v-img-wrapper"
            onClick={imageOnClick}
          >
            {imageOnClickPrompt}
          </div>
        }
      </div>
      
      <EpubEditor description 
        title="Audio Description Editor"
        text={audioDescription} 
        type={adEditor}   
      />

      <EpubEditor 
        title="ePub Content Editor"
        text={text}
        type={txtEditor}
      />
    </div>
  ) : null
}

export default ChapterView