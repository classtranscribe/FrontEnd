import React from 'react'
import { Button } from 'semantic-ui-react'
import './index.css'
import { keydownControl } from '../../../Utils'

export function TabEventHelperButtons({

}) {
  
  return (
    <div className="watch-tab-helper">
      <Button.Group>
        <Button
          id="skip-to-continue"
          className="skip-btn"
          onClick={() => keydownControl.skipToContinue()}
        >
          Continue
        </Button>
        <Button
          id="skip-to-ctrl-bar"
          className="skip-btn"
          onClick={() => keydownControl.skipToControlBar()}
        >
          Skip to Control Bar
        </Button>
        <Button
          id="skip-to-caption-box"
          className="skip-btn"
          onClick={() => keydownControl.skipToCaptionBox()}
        >
          Skip to Caption Box
        </Button>
      </Button.Group>
    </div>
  )
}