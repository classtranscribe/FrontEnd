import React from 'react'
import './index.css'
import {
  SecondaryPlayerWrapper,
  BigPlayButton,
  ClosedCaption
} from '../Overlays'
import { videoControl } from '../../Utils'

function PlayerWrapper({
  isPrimary=false,
}) {
  return isPrimary ? (
    <div className="watch-player-wrapper" 
      onClick={() => videoControl.handlePause()}
    >
      <ClosedCaption isPrimary={isPrimary} />
      <BigPlayButton isPrimary={isPrimary} />
    </div>
  ) : (
    <SecondaryPlayerWrapper isPrimary={isPrimary} />
  )
}

export default PlayerWrapper
