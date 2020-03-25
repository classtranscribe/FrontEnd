import React from 'react'
import { connectWithRedux, epub } from '../../Utils'
import { Button } from 'pico-ui'

function ActionButtonsWithRedux({
  saveEpub,
  // cancelEditing,
  isEditingEpub=false,
}) {
  return isEditingEpub ? (
    <div className="msp-ee-act ct-a-fade-in">
      <Button round size="big"
        classNames="ee-act-btn ee-act-save-btn"
        text="Save and Preview"
        color="teal"
        onClick={saveEpub}
      />

      {/* <Button round size="big"
        classNames="ee-act-btn"
        text="Cancel"
        color="black"
        onClick={cancelEditing}
      /> */}
    </div>
  ) : (
    <div className="msp-ee-act ct-a-fade-in">
      <Button round size="big"
        classNames="ee-act-btn"
        text="Manage ePub Chapters"
        color="black"
        onClick={() => epub.isEditingEpub(true)}
      />
    </div>
  )
}

export default connectWithRedux(
  ActionButtonsWithRedux,
  ['isEditingEpub'],
  []
)
