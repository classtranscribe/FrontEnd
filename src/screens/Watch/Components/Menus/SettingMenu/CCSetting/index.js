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
  captions=[]
}) {
  const handleOpenCC = () => {
    transControl.handleOpenCC()
  }

  let disabled = captions.length <= 0

  return (
    <form className="watch-menu-tab">
      <h2 className="watch-menu-tab-title">Closed Caption</h2>
      { disabled && <p>Sorry, the closed caption of this video is currently unavailable.</p> }
      <div className="w-100">
        <MenuRadio 
          id="open-cc-radio"
          label="Open Closed Caption (c)" 
          onChange={handleOpenCC}
          checked={openCC}
          disabled={disabled}
        />
      </div>
      {
        !disabled
        &&
        <>
          <h2 className="watch-menu-tab-title">Customize Closed Caption Style</h2>
          <div className="w-100 d-flex">
            <CCStylePicker />
          </div>
        </>
      }
    </form>
  )
}

export default connectWithRedux(
  CCSetting,
  ['openCC', 'captions'],
  []
)