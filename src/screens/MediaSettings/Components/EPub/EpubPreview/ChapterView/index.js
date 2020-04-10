import React from 'react'
import { api, util } from 'utils'
import './index.scss'
import EpubEditor from '../EpubEditor'
import { EDITOR_RICHTEXT } from 'screens/MediaSettings/Utils'

const ChapterView = ({
  editor,
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
  const { text, image, title, id } = chapter
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
      
      <EpubEditor text={text} type={editor} />
    </div>
  ) : null
}

export default ChapterView