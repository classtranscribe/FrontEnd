import React, { useState } from 'react'
import { PLAYBACKRATE } from '../../../Utils'
import './index.css'

function PlaybackrateMenu({
  show=false,
  handleClose=null,

  currPlaybackrate=1.0,
  setPlaybackrate=null,
}) {

  const [sliderValue, setSliderValue] = useState(1.0)
  const [isCustomized, setIsCustomized] = useState(false)
  const handleSliderChange = ({ target: {value} }) => {
    setSliderValue(value)
    // console.log('value', value)
    //setPlaybackrate(value)
    if (!isCustomized) setIsCustomized(true)
  }

  const handleChooseRate = rate => () => {
    //setPlaybackrate(rate)
    setIsCustomized(false)
  }

  return show ? (
    <div className="watch-playbackrate-menu">
      <div className="customize-playbackrate">
        <label className="customize-playbackrate-title">
          Customized rate - 
          <span className="customize-playbackrate-num">{sliderValue}</span>
        </label>
        <input 
          className="playbackrate-slider"
          type="range" 
          min={0.25} 
          max={4}
          step={0.05}
          value={sliderValue} 
          onChange={handleSliderChange}
        />
      </div>
      <div className="playbackrate-list" role="list">
        {PLAYBACKRATE.map( rate => (
          <button 
            key={`playback-rate-${rate}`}
            role="listitem"
            className="plain-btn playbackrate-listitem"
            aria-label={`playback-rate-${rate}`}
            isCurrentRate={Boolean(currPlaybackrate === rate && !isCustomized).toString()}
            onClick={handleChooseRate(rate)}
          >
            <div className="playbackrate-listitem-checkmark">
              {
                (currPlaybackrate === rate && !isCustomized) 
                && 
                <i className="material-icons">check</i>
              }
            </div>
            <p className="playbackrate-num">{rate}</p>
          </button>
        ))}
        {
          isCustomized
          &&
          <button 
            key={`customized-playback-rate-${sliderValue}`}
            role="listitem"
            className="plain-btn playbackrate-listitem"
            aria-label={`customized-playback-rate-${sliderValue}`}
            isCurrentRate="true"
          >
            <div className="playbackrate-listitem-checkmark">
              <i className="material-icons">check</i>
            </div>
            <p className="playbackrate-num customized-playbackrate-listitem">{sliderValue}</p>
          </button>
        }
      </div>
    </div>
  ) : null
} 

export default PlaybackrateMenu;