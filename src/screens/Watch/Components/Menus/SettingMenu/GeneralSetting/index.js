import React, { useState, useEffect } from 'react'
import { connectWithRedux } from '../../../../../../_redux/watch'
import MenuRadio from '../MenuRadio'
import { 
  // videoControl,
  preferControl,
} from '../../../../Utils'

function GeneralSetting({
  show=false,
}) {

  const [autoPlay, setAutoPlay] = useState(preferControl.autoPlay())

  const handleAutoPlay = () => {
    setAutoPlay( !autoPlay )
    preferControl.autoPlay( !autoPlay )
  }

  useEffect(() => {
    if (show) {
      document.getElementById('general-settings').scrollIntoView({ block: 'center' })
    }
  }, [show])

  return (
    <form className="watch-menu-tab" id="general-settings">
      <h2 className="watch-menu-tab-title">General</h2>
      <div className="w-100">
        <MenuRadio 
          id="auto-play-checkbox"
          label="Auto Play" 
          onChange={handleAutoPlay}
          checked={autoPlay}
        />
      </div>
    </form>
  )
}

export default connectWithRedux(
  GeneralSetting,
  [],
  []
)