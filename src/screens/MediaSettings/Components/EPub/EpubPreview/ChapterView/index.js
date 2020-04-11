import React from 'react'
import { api, util } from 'utils'
import './index.scss'
import EpubEditor from '../EpubEditor'
import { EDITOR_RICHTEXT, EDITOR_NONE } from 'screens/MediaSettings/Utils'

const ChapterView = ({
  txtEditor,
  adEditor,
  chapter,
  shadow=false,
  round=false,
  contentEditable=false,
  onEdit=null,
  titleOnKeyDown,
  textOnKeyDown,
  imageOnClick,
  imageOnClickPrompt,
}) => {
  const { text, image, title, id, audioDescription } = chapter
  const handleInput = type => e => {
    if (onEdit) onEdit(type, e.target.innerText)
  }

  const handleTitleKeydown = e => {
    util.preventBreakLine(e)
    if (titleOnKeyDown) titleOnKeyDown(e)
  }

  const style = "msp-e-view ct-a-fade-in" 
              + (shadow ? " shadow" : "") 
              + (round ? " round" : "")

  return image ? (
    <div className={style}>
      <div className="w-100">
        <h2 contentEditable={contentEditable}
          onInput={handleInput('title')}
          onKeyDown={handleTitleKeydown}
          dangerouslySetInnerHTML={{__html: title || "Chapter"}}
        />
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