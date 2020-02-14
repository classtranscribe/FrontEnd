import React, { useState, useEffect } from 'react'
import { MSPSidebar } from '../../MSPSidebar'
import { Button } from 'pico-ui'
import { connectWithRedux, epub } from '../../../Utils'

function SettingSidebar({
  epubData=[],
}) {

  const onSave = () => {
    epub.saveResetEpub()
  }

  const onCancel = () => {
    epub.cancelResetEpub()
  }
  
  return (
    <>
      <div className="msp-e-ssb-btns">
        <Button uppercase
          text="discard changes"
          color="teal transparent"
          icon="chevron_left"
          onClick={onCancel}
        />
        <Button uppercase
          text="save"
          color="teal"
          onClick={onSave}
        />
      </div>

      <MSPSidebar.Item 
        icon="add"
        title="NEW CHAPTER"
        rightIcon="small"
      />
    </>
  )
}

export default connectWithRedux(
  SettingSidebar,
  ['epubData'],
  []
)