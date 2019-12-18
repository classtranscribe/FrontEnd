import React, { useState, useEffect } from 'react'
import { connectWithRedux } from '_redux/watch'
import MenuRadio from '../MenuRadio'
import { 
  transControl, 
  preferControl,
} from '../../../../Utils'
import { userAction, util } from 'utils'

function ADSetting({
  show=false,
  openAD=false,
  descriptions=[]
}) {

  const [pauseWhileAD, setPauseWhileAD] = useState(preferControl.pauseWhileAD())

  const handleAD = ({ target: { checked } }) => {
    transControl.handleOpenAD()
  }

  const handlePauseWhileAD = () => {
    preferControl.pauseWhileAD( !pauseWhileAD )
    userAction.pauseWhenADStarts( !pauseWhileAD )
    setPauseWhileAD( !pauseWhileAD )
  }

  useEffect(() => {
    if (show) {
      document.getElementById('ad-settings').scrollIntoView({ block: 'center' })
    }
  }, [show])

  let disabled = descriptions.length <= 0

  return (
    <form className="watch-menu-tab" id="ad-settings">
      <h2 className="watch-menu-tab-title">Audio Description</h2>
      { disabled && <p>Sorry, audio description of this video is currently unavailable.</p> }
      <div className="w-100">
        <MenuRadio 
          id="ad-open-radio"
          label="Open Audio Description" 
          onChange={handleAD}
          checked={openAD && !disabled}
          disabled={disabled}
        />
        <MenuRadio 
          id="ad-pause-radio"
          label="Pause video when Audio Description starts" 
          onChange={handlePauseWhileAD}
          checked={pauseWhileAD && !disabled}
          disabled={disabled}
          description="Turn on to automatically pause video when there is a audio description."
        />
      </div>
    </form>
  )
}

export default connectWithRedux(
  ADSetting,
  ['openAD', 'descriptions'],
  []
)