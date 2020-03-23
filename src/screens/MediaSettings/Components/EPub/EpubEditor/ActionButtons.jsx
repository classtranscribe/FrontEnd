import React from 'react'
import { Button } from 'pico-ui'

export default function ActionButtons({
  saveEpub,
}) {
  return (
    <div className="msp-ee-act">
      <Button round size="big"
        classNames="ee-act-btn ee-act-save-btn"
        text="Save ePub"
        color="teal"
        onClick={saveEpub}
      />

      <Button round size="big"
        classNames="ee-act-btn"
        text="Back to ePub view"
        color="black"
      />
    </div>
  )
}
