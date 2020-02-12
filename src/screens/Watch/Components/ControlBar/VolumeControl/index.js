import React from 'react'
import { Popup } from 'semantic-ui-react'
import { connectWithRedux, videoControl } from '../../../Utils'
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
    videoControl.mute()
  }

  const handleVolumeKeyDown = e => {
    const { keyCode } = e
    if (keyCode === 37 || keyCode === 39) {
      e.preventDefault()
    }
  }

  const iconName = muted ? 'volume_off' : volume >= 0.5 ? 'volume_up' : 'volume_down'

  return (
    <div className="watch-volume-ctrl">
      <Popup inverted wide basic
        position="top center"
        offset="0, 15px"
        openOnTriggerClick={false}
        openOnTriggerFocus
        closeOnTriggerBlur
        content={<strong>{muted ? 'Unmute (m)' : 'Mute (m)'}</strong>}
        trigger={
          <button 
            className="watch-ctrl-button" 
            onClick={handleButtonClick}
            aria-label={muted ? 'Unmute' : 'Mute'}
            id="volume-mute-btn"
            position="bottom"
          >
            <span className="watch-btn-content" tabIndex="-1">
              <i className="material-icons">{iconName}</i>       
            </span>
          </button>
        }
      />

      <Popup inverted wide basic
        position="top center"
        offset="0, 15px"
        openOnTriggerClick={false}
        openOnTriggerFocus
        closeOnTriggerBlur
        content={<strong>Volume: {Math.floor(volume * 100)}%</strong>}
        trigger={
          <input 
            id="volume-slider"
            className="volume-slider"
            aria-label={`Volume Slider - Current Volume: ${Math.floor(volume * 100)}`}
            type="range" 
            min={0} 
            max={1}
            step={0.05}
            onKeyDown={handleVolumeKeyDown}
            onChange={handleVolumeChange}
          />
        }
      />
    </div>
  )
}

export default connectWithRedux(
  VolumeControl,
  ['volume', 'muted'],
  []
)