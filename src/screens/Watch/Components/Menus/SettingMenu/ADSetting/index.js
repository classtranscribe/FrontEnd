import React, { useState } from 'react'
import { connectWithRedux } from '_redux/watch'
import MenuRadio from '../MenuRadio'
import { 
  transControl, 
  preferControl,
} from '../../../../Utils'

function ADSetting({
  openAD=false,
}) {

  const [pauseWhileAD, setPauseWhileAD] = useState(preferControl.pauseWhileAD())

  const handleAD = ({ target: { checked } }) => {
    transControl.handleOpenAD()
  }

  const handlePauseWhileAD = () => {
    preferControl.pauseWhileAD( !pauseWhileAD )
    setPauseWhileAD( !pauseWhileAD )
  }

  return (
    <form className="watch-menu-tab">
      <h2 className="watch-menu-tab-title">Audio Description</h2>
      <div className="w-100">
        <MenuRadio 
          id="ad-open-radio"
          label="Open Audio Description" 
          onChange={handleAD}
          checked={openAD}
        />
        <MenuRadio 
          id="ad-pause-radio"
          label="Pause video when Audio Description starts" 
          onChange={handlePauseWhileAD}
          checked={pauseWhileAD}
          description="Turn on to automatically pause video when there is a audio description."
        />
      </div>
    </form>
  )
}

export default connectWithRedux(
  ADSetting,
  ['openAD'],
  []
)