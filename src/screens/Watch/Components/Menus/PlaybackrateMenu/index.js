import React, { useState } from 'react'
import { connectWithRedux } from '_redux/watch'
import { PLAYBACKRATE } from '../../../Utils'
import './index.css'
import './slider.scss'

function PlaybackrateMenu({
  show=false,
  onClose=null,

  playbackrate,
  setPlaybackrate=null,
}) {
  // console.log('???', setPlaybackrate)
  const [sliderValue, setSliderValue] = useState(1.0)
  // isCustomized - 0:unset, 1:
  const [isCustomized, setIsCustomized] = useState(0)

  const usingCustomizedRate = isCustomized === 2

  const chooseCustomizedRate = rate => () => {
    setPlaybackrate(rate)
    if (!usingCustomizedRate) setIsCustomized(2)
  }

  const handleSliderChange = ({ target: {value} }) => {
    setSliderValue(value)
    setPlaybackrate(value)
    setIsCustomized(2)
  }

  const handleChooseRate = rate => () => {
    setPlaybackrate(rate)
    setIsCustomized(isCustomized >= 2 ? 3 : 1)
  }

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
            is-current-rate={Boolean(playbackrate === rate && !usingCustomizedRate).toString()}
            onClick={handleChooseRate(rate)}
          >
            <div className="playbackrate-listitem-checkmark">
              {
                (playbackrate === rate && !usingCustomizedRate) 
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
            onClick={chooseCustomizedRate(sliderValue)}
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

        <button className="plain-btn watch-menu-close-btn watch-playbackrate-menu-close-btn" onClick={onClose}>
          <i className="material-icons">close</i>
        </button>
      </div>
    </div>
  ) : null
} 

export default connectWithRedux(
  PlaybackrateMenu,
  ['playbackrate'],
  ['setPlaybackrate']
)