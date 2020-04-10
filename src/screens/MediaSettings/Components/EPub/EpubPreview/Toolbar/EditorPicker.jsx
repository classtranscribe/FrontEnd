import React, { useState } from 'react'
import _ from 'lodash'
import { Button } from 'pico-ui'
import { EpubMenu } from '../../EpubMenu'
import { textEditorMap } from 'screens/MediaSettings/Utils'

const textEditorOptions = _.map(textEditorMap, (text, value) => ({ text, value }))

export default function EditorPicker({
  editor,
  setEditor
}) {

  const [anchorEl, setAnchorEl] = useState(null)

  const handleItemClick = value => {
    setEditor(value)
  }

  return (
    <EpubMenu
      trigger={
        <>
          <Button outlined
            // color="transparent"
            classNames="ee-tb-btn epicker" 
            onClick={e => setAnchorEl(e.currentTarget)} 
            icon="arrow_drop_down"
          >
            {textEditorMap[editor]}
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
