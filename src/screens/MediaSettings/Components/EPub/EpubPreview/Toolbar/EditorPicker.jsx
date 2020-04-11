import React, { useState } from 'react'
import _ from 'lodash'
import { Button } from 'pico-ui'
import { EpubMenu } from '../../EpubMenu'
import { textEditorMap, epub } from 'screens/MediaSettings/Utils'

const textEditorOptions = _.map(textEditorMap, (text, value) => ({ text, value }))

export default function EditorPicker({
  defaultEditor,
  editor,
  setEditor,
  outlined,
  color,
  className,
  icon="arrow_drop_down",
  text,
}) {

  const [anchorEl, setAnchorEl] = useState(null)

  const handleItemClick = value => {
    setEditor(value)
    epub.startEditContent(value)
  }

  const handleTriggerClick = e => {
    if (defaultEditor) {
      handleItemClick(defaultEditor)
    } else {
      setAnchorEl(e.currentTarget)
    }
  }

  return (
    <EpubMenu
      trigger={
        <>
          <Button 
            color={color}
            outlined={outlined}
            classNames={className}
            onClick={handleTriggerClick} 
            icon={icon}
          >
            {text || textEditorMap[editor]}
          </Button>
        </>
      }
      anchorEl={anchorEl}
      value={editor}
      setAnchorEl={setAnchorEl}
      items={textEditorOptions}
      handleItemClick={handleItemClick}
    />
  )
}
