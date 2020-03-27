import React from 'react'
import { connectWithRedux, epub } from '../../Utils'
import { Button } from 'pico-ui'

function ActionButtonsWithRedux({
  isEditingEpub=false,
}) {
  return isEditingEpub ? (
    <div className="msp-ee-act ct-a-fade-in">
      <Button round size="big"
        classNames="ee-act-btn ee-act-save-btn"
        text="Save and Preview"
        color="teal"
        onClick={() => epub.saveChapters()}
      />

      {/* <Button round size="big"
        classNames="ee-act-btn"
        text="Cancel"
        color="black"
        onClick={cancelEditing}
      /> */}
    </div>
  ) : (
    <div className="msp-ee-act ct-a-fade-in" data-editing="false">
      <Button.Group>
        <Button round //size="big"
          classNames="ee-act-btn"
          text="Manage ePub Chapters"
          color="black"
          onClick={() => epub.cancelEditChapters()}
        />

        <Button round //size="big"
          classNames="ee-act-btn ee-act-save-btn"
          text="Download"
          color="teal"
          //onClick={saveEpub}
        />
      </Button.Group>
    </div>
  )
}

export default connectWithRedux(
  ActionButtonsWithRedux,
  ['isEditingEpub'],
  []
)
