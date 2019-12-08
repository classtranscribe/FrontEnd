import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { 
  videoControl,
  NORMAL_MODE,
  CTP_LOADING,
  promptControl, 
} from '../../../Utils'
import './index.css'

function SecondaryPlayerWrapperWithRedux({
  mode=NORMAL_MODE,
  ctpSecEvent=CTP_LOADING,
  isPrimary=false,
}) {

  const onSwitch = () => videoControl.switchVideo()
  const onHide = () => {
    videoControl.mode(NORMAL_MODE)
    promptControl.hideSecondaryScreen()
  }

  return !isPrimary ? ctpSecEvent === CTP_LOADING ? 
  (
    <div className="watch-secondary-wrapper" data-blur={Boolean(ctpSecEvent === CTP_LOADING).toString()}>
      <div>
        <div className="sk-chase" color="green">
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
        </div>
      </div>
    </div>
  ) : (
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
          onClick={onHide}
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
  ['mode', 'ctpSecEvent'], 
  []
)
