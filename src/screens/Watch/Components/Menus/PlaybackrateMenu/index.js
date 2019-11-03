import React, { useState } from 'react'
import { PLAYBACKRATE } from '../../../Utils'
import './index.css'
import './slider.scss'

function PlaybackrateMenu({
  show=false,
  handleClose=null,

  currPlaybackrate=1.0,
  setPlaybackrate=null,
}) {

  const [sliderValue, setSliderValue] = useState(2.1)
  const [isCustomized, setIsCustomized] = useState(0)

  const handleSliderChange = ({ target: {value} }) => {
    setSliderValue(value)
    // console.log('value', value)
    //setPlaybackrate(value)
    setIsCustomized(2)
  }

  const handleChooseRate = rate => () => {
    //setPlaybackrate(rate)
    setIsCustomized(isCustomized === 2 ? 3 : 1)
  }

  console.log(currPlaybackrate === sliderValue)
  const usingCustomizedRate = isCustomized === 2

  return show ? (
    <div className="watch-playbackrate-menu">
      {/* Playback Rate Customization Slider */}
      <div className="customize-playbackrate">
        <label className="customize-playbackrate-title" for="playback-rate-slider">
          Customized rate - 
          <span className="customize-playbackrate-num">{sliderValue}</span>
        </label>
        <input 
          id="playback-rate-slider"
          className="playbackrate-slider"
          type="range" 
          min={0.25} 
          max={4}
          step={0.05}
          value={sliderValue} 
          onChange={handleSliderChange}
        />
      </div>

      {/* Playback Rate option list */}
      <div className="playbackrate-list" role="list">
        {PLAYBACKRATE.map( rate => (
          <button 
            key={`playback-rate-${rate}`}
            role="listitem"
            className="plain-btn playbackrate-listitem"
            aria-label={`playback-rate-${rate}`}
            is-current-rate={Boolean(currPlaybackrate === rate && !usingCustomizedRate).toString()}
            onClick={handleChooseRate(rate)}
          >
            <div className="playbackrate-listitem-checkmark">
              {
                (currPlaybackrate === rate && !usingCustomizedRate) 
                && 
                <i className="material-icons">check</i>
              }
            </div>
            <p className="playbackrate-num">{rate}</p>
          </button>
        ))}

        {/* Customized Rate */}
        {
          isCustomized >= 2
          &&
          <button 
            key={`customized-playback-rate-${sliderValue}`}
            role="listitem"
            className="plain-btn playbackrate-listitem"
            aria-label={`customized-playback-rate-${sliderValue}`}
            is-current-rate={usingCustomizedRate.toString()}
            onClick={handleChooseRate(sliderValue)}
          >
            <div className="playbackrate-listitem-checkmark">
              {
                usingCustomizedRate
                && 
                <i className="material-icons">check</i>
              }
            </div>
            <p className="playbackrate-num customized-playbackrate-listitem">{sliderValue} <span>(Customized)</span></p>
          </button>
        }
      </div>
    </div>
  ) : null
} 

export default PlaybackrateMenu;