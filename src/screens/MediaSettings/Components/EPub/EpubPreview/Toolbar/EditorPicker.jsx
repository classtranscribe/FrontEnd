import React, { useState } from 'react'
import _ from 'lodash'
import { Button } from 'pico-ui'
import { EpubMenu } from '../../EpubMenu'
import { mspPreference as pref  } from 'utils/user-preference/media-settings'
import { textEditorMap, epub } from 'screens/MediaSettings/Utils'

const textEditorOptions = _.map(textEditorMap, (text, value) => ({ text, value }))

export default function EditorPicker({
  description,
  editor,
  setEditor,
  defaultEditor,
  outlined,
  color,
  className,
  icon="arrow_drop_down",
  text,
}) {

  const [anchorEl, setAnchorEl] = useState(null)

  const handleItemClick = value => {
    setEditor(value)
    pref.defaultEditor(value)
  }

  const handleTriggerClick = e => {
    let prefEditor = pref.defaultEditor()
    if (defaultEditor) prefEditor = defaultEditor
    if (prefEditor && !outlined) {
      handleItemClick(prefEditor)
    } else {
      setAnchorEl(e.currentTarget)
    }

    epub.startEditContent(editor, description)
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
