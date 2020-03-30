import React from 'react'
import _ from 'lodash'
import { Dropdown } from 'semantic-ui-react'
import { Button } from 'pico-ui'
import { langMap } from 'screens/Watch/Utils'
import { epub } from 'screens/MediaSettings/Utils'

const langOptions = _.map(langMap, (text, value) => ({ text, value }))

export default function Toolbar({
  language
}) {
  return (
    <div className="msp-ee-ep-tb ct-a-fade-in">
      {/* <div className="ee-ep-tb-top-holder"></div> */}
      <Dropdown floating fluid
        trigger={
          <Button outlined
            classNames="ee-tb-btn" 
            icon="arrow_drop_down" 
            text={langMap[language]} 
          />
        }
        icon={null}
        value={language}
        options={langOptions}
        onChange={(e, { value }) => epub.changeLanguage(value)}
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
