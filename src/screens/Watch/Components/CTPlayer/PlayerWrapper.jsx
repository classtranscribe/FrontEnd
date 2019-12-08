import React from 'react'
import { connectWithRedux } from '_redux/watch'
import './index.css'
import {
  SecondaryPlayerWrapper,
  BigPlayButton,
  ClosedCaption,
  AudioDescription,
} from '../Overlays'
import { 
  videoControl, 
  CTP_LOADING, CTP_ENDED 
} from '../../Utils'

function PlayerWrapper({
  isPrimary=false,
  ctpPriEvent=CTP_LOADING
}) {

  const shouldBlur = [CTP_LOADING, CTP_ENDED].includes(ctpPriEvent)
  const handleClick = () => {
    if (!shouldBlur) {
      videoControl.handlePause()
    }
  }


  
  return isPrimary ? (
    <div className="watch-player-wrapper" 
      onClick={handleClick}
      data-blur={shouldBlur.toString()}
    >
      <ClosedCaption isPrimary={isPrimary} />
      <BigPlayButton isPrimary={isPrimary} />
      <AudioDescription isPrimary={isPrimary} />
    </div>
  ) : (
    <SecondaryPlayerWrapper isPrimary={isPrimary} />
  )
}

export default connectWithRedux(
  PlayerWrapper,
  ['ctpPriEvent'],
  []
)
