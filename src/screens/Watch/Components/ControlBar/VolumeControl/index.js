import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { videoControl } from '../../../Utils'
import './index.css'
import './slider.scss'

function VolumeControl({
  muted=false,
  volume=true,
}) {

  const handleVolumeChange = ({ target: { value } }) => {
    if (muted) {
      videoControl.mute(false)
    }

    videoControl.volume(value)

    if (value < 0.1) {
      videoControl.mute(true)
    }
  }

  const handleButtonClick = () => {
    if (muted) {
      videoControl.mute(false)
    } else {
      videoControl.mute(true)
    }
  }

  const iconName = muted ? 'volume_off' : volume >= 0.5 ? 'volume_up' : 'volume_down'

  return (
    <div className="watch-volume-ctrl">
      <button className="watch-ctrl-button" onClick={handleButtonClick}>
        <span className="watch-btn-content" tabindex="-1">
          <i className="material-icons">{iconName}</i>       
        </span>
      </button>

      <input 
        id="volume-slider"
        className="volume-slider"
        aria-label="Volume Slider"
        type="range" 
        min={0} 
        max={1}
        step={0.05}
        onChange={handleVolumeChange}
      />
    </div>
  )
}

export default connectWithRedux(
  VolumeControl,
  ['volume', 'muted'],
  []
)