import React from 'react'
import { Button } from 'pico-ui'
import { epub } from 'screens/MediaSettings/Utils'
import './index.scss'
import { LanguageMenuTrigger } from '../../LanguageMenuTrigger'


export default function Toolbar({
  language
}) {

  return (
    <div className="msp-ee-ep-tb ct-a-fade-in">
      <LanguageMenuTrigger
        language={language}
        classNames="ee-tb-btn"
      />

      <div className="ee-tb-btns">
        <Button classNames="ee-tb-btn" color="transparent">
          Add Audio Description
        </Button>
        <Button classNames="ee-tb-btn" color="transparent">
          New Section
        </Button>

        <Button round
          classNames="ee-tb-btn ee-tb-btn-me" 
          color="black" 
          onClick={() => epub.isEditingEpub(true)}
        >
          Manage Chapters
        </Button>
        <Button round
          classNames="ee-tb-btn ee-tb-btn-me" 
          color="teal" 
          onClick={() => epub.download()}
        >
          Download ePub
        </Button>
      </div>
    </div>
  )
}
