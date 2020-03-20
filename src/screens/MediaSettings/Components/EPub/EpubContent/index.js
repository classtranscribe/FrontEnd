import React, { useState, useEffect } from 'react'
import { Button } from 'pico-ui'
import { PlaceHolder } from '../../../../../components'
import { UserTipsForEditing, UserTipsForCombining } from './UserTips'
import { api, util } from '../../../../../utils'
import { epub } from '../../../Utils'
import _ from 'lodash'
import './index.scss'

function EpubContent({
  currChapter,
  handleChapterClick,
}) {

  const { id, title, text, image } = currChapter
  let titleToSave = title
  const [texts, setTexts] = useState(epub.splitText(text))
  const [addedNewTxtId, setAddedNewTxtId] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const addATextarea = () => {
    let txts = epub.texts()
    if (txts.length === 0 || txts[txts.length-1].text) {
      let newId = new Date().toISOString()
      setAddedNewTxtId(newId)
      txts.push({ text: '', id: newId })
      setTexts(epub.textsCopy())
      if (!isEditing) setIsEditing(true)
    }
  }

  const removeTextarea = (id) => {
    if (!isEditing) setIsEditing(true)
    let txts = epub.texts()
    _.remove(txts, { id })
    setTexts(epub.textsCopy())
  }

  const onInput = id => e => {
    if (id === 'title') {
      titleToSave = e.target.innerText
    } else {
      let txts = epub.texts()
      let txtObj = _.find(txts, { id })
      if (txtObj) {
        txtObj.text = e.target.innerText
      } else {
        // console.error('texts', txts, id)
      }
    }
    if (!isEditing) setIsEditing(true)
  }

  const onKeyDown = e => {
    const { keyCode, ctrlKey, shiftKey } = e
    if (keyCode === 13) { // hit return => new paragraph
      e.preventDefault()
      addATextarea()
    } else if (keyCode === 8) { // hit delete => remove paragraph
      if (e.target.innerText === '' || (ctrlKey && shiftKey)) {
        removeTextarea(e.target.id)
      }
    }
  }

  const onKeyDownForTitle = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
    }
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
    if (texts.length > 0 && (addedNewTxtId || texts[0].text === '')) {
      let textElem = document.getElementById(addedNewTxtId || texts[0].id)
      // console.log('textElem', textElem, texts[texts.length - 1].id)
      if (textElem && textElem.innerText === '') {
        textElem.focus()
      }
    }
  }, [texts])

  useEffect(() => {
    if (isEditing) {
      setIsEditing(false)
    }
    if (text !== undefined) {
      setTexts(epub.splitText(text))
      epub.texts(epub.splitText(text))
    }
    util.scrollToTop('#msp-e-view')
  }, [currChapter])

  return Boolean(title) 
  ? 
  (
    <div className="msp-e-view-con">
      <div id="msp-e-view" className="msp-e-view-box" data-scroll>

        <div className="msp-e-v-instructions">
          <UserTipsForEditing />
        </div>
        
        <div className="msp-e-view">
          <div className="w-100">
            <h2 contentEditable
              onInput={onInput('title')}
              onKeyDown={onKeyDownForTitle}
              dangerouslySetInnerHTML={{__html: title || "Chapter"}}
            />
          </div>
          <img src={api.getMediaFullPath(image)} />
          
          <div className="w-100">
            {texts.map( (txt, index) => (
              <div className="w-100" key={txt.id}>
                <div contentEditable
                  id={txt.id}
                  className="msp-e-v-text"
                  dangerouslySetInnerHTML={{ __html: txt.text }} 
                  onInput={onInput(txt.id)}
                  onKeyDown={onKeyDown}
                />
              </div>
            ))}
          </div>
          <div className="w-100 ct-d-r-end align-items-center mt-3">
            {/* <UserTipsForEditing /> */}
            <Button uppercase
              icon="add"
              text="add a paragraph"
              color="transparent"
              onClick={addATextarea}
            />
          </div>
        </div>
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