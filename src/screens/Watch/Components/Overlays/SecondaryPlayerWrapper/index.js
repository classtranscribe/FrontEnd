import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { 
  NORMAL_MODE,
  videoControl, 
} from '../../../Utils'
import './index.css'

function SecondaryPlayerWrapperWithRedux({
  mode=NORMAL_MODE,
  isPrimary=false,
}) {

  const onSwitch = () => videoControl.switchVideo()
  const onClose = () => videoControl.mode(NORMAL_MODE)

  return !isPrimary ? (
    <div className="watch-secondary-wrapper" mode={mode}>
      <div className="watch-secondary-wrapper-left">
        <button 
          className="watch-secondary-wrapper-button plain-btn ripple-btn"
          content="switch"
          aria-label="Switch Screen"
          onClick={onSwitch}
        >
          <p className="text-center">
            <i className="material-icons">compare_arrows</i><br/>
            <strong>Switch</strong>
          </p>
        </button>
      </div>
      <div className="watch-secondary-wrapper-right">
        <button 
          className="watch-secondary-wrapper-button plain-btn ripple-btn"
          content="close"
          aria-label="Hide Screen"
          onClick={onClose}
        >
          
          <p className="text-center">
            <i className="material-icons">close</i><br/>
            <strong>Hide</strong>
          </p>
        </button>
      </div>
    </div>
  ) : null
}

export const SecondaryPlayerWrapper = connectWithRedux(
  SecondaryPlayerWrapperWithRedux,
  ['mode'], 
  []
)