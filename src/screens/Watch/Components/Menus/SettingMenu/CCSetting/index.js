import React from 'react'
import { connectWithRedux } from '_redux/watch'
import MenuRadio from '../MenuRadio'
import CCStylePicker from './CCStylePicker'
import './index.css'
import { 
  transControl, 
} from '../../../../Utils'


function CCSetting({
  openCC,
}) {
  const handleOpenCC = () => {
    transControl.handleOpenCC()
  }

  return (
    <form className="watch-menu-tab">
      <h2 className="watch-menu-tab-title">Closed Caption</h2>
      <div className="w-100">
        <MenuRadio 
          id="open-cc-radio"
          label="Open Closed Caption (c)" 
          onChange={handleOpenCC}
          checked={openCC}
        />
      </div>
      <h2 className="watch-menu-tab-title">Customize Closed Caption Style</h2>
      <div className="w-100">
        <CCStylePicker />
      </div>
    </form>
  )
}

export default connectWithRedux(
  CCSetting,
  ['openCC'],
  []
)