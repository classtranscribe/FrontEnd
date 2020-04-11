import React, { useState } from 'react'
import _ from 'lodash'
import { Button } from 'pico-ui'
import { EpubMenu } from '../../EpubMenu'
import { textEditorMap } from 'screens/MediaSettings/Utils'

const textEditorOptions = _.map(textEditorMap, (text, value) => ({ text, value }))

export default function EditorPicker({
  editor,
  setEditor,
  outlined,
  color,
  className,
  icon="arrow_drop_down",
  text,
  after,
}) {

  const [anchorEl, setAnchorEl] = useState(null)

  const handleItemClick = value => {
    setEditor(value)
    if (after) after()
  }

  return (
    <EpubMenu
      trigger={
        <>
          <Button 
            color={color}
            outlined={outlined}
            classNames={className}
            onClick={e => setAnchorEl(e.currentTarget)} 
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
