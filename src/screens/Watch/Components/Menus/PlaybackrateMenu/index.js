import React, { useState, useEffect } from 'react'
import { 
  connectWithRedux,
  playbackRateOptions,
  videoControl
} from '../../../Utils'
import './index.css'
import './slider.scss'

function PlaybackrateMenu({
  show=false,
  onClose=null,
  playbackrate=1,
}) {
  // console.log('???', setPlaybackrate)
  const [sliderValue, setSliderValue] = useState(1)
  // isCustomized - 0:unset, 1:
  const [isCustomized, setIsCustomized] = useState(0)

  const usingCustomizedRate = isCustomized === 2
  useEffect(() => {
    if (!playbackRateOptions.includes(playbackrate)) {
      setSliderValue(playbackrate)
      if (!usingCustomizedRate) setIsCustomized(2)
    }
  }, [playbackrate])

  

  const chooseCustomizedRate = value => () => {
    videoControl.playbackrate(value)
    setTimeout(() => onClose(), 200);
  }

  const handleSliderChange = ({ target: {value} }) => {
    videoControl.playbackrate(value)
  }

  const handleChooseRate = value => () => {
    videoControl.playbackrate(value)
    setIsCustomized(isCustomized >= 2 ? 3 : 1)
    setTimeout(() => onClose(), 200);
  }

  const handleKeyDown = e => {
    const { keyCode } = e
    if (keyCode === 37 || keyCode === 39) {
      e.preventDefault()
    }
  }

  return (
    <div id="watch-playbackrate-menu" role="menu" aria-label="Playback Rate Menu" className="watch-playbackrate-menu">
      <button className="plain-btn watch-menu-close-btn watch-playbackrate-menu-close-btn" onClick={onClose}>
        <i className="material-icons">close</i>
      </button>

      {/* Playback Rate Customization Slider */}
      <div className="customize-playbackrate">
        <label className="customize-playbackrate-title" htmlFor="playback-rate-slider">
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
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Playback Rate option list */}
      <div className="playbackrate-list" role="list">
        {/* Customized Rate */}
        {
          isCustomized >= 2
          &&
          <button 
            key={`customized-playback-rate-${sliderValue}`}
            role="listitem"
            className="plain-btn watch-icon-listitem playbackrate-listitem"
            aria-label={`customized-playback-rate-${sliderValue}`}
            active={usingCustomizedRate.toString()}
            onClick={chooseCustomizedRate(sliderValue)}
            role="menuitem"
          >
            <span tabIndex="-1">
              <div className="playbackrate-listitem-checkmark">
                {
                  usingCustomizedRate
                  && 
                  <i className="material-icons">check</i>
                }
              </div>
              <p className="playbackrate-num customized-playbackrate-listitem">{sliderValue} <span>(Customized)</span></p>
            </span>
          </button>
        }

        {playbackRateOptions.slice().reverse().map( rate => (
          <button 
            key={`playback-rate-${rate}`}
            role="listitem"
            className="plain-btn watch-icon-listitem playbackrate-listitem"
            aria-label={`playback-rate-${rate}`}
            active={Boolean(playbackrate === rate && !usingCustomizedRate).toString()}
            onClick={handleChooseRate(rate)}
            role="menuitem"
          >
            <span tabIndex="-1">
              <div className="playbackrate-listitem-checkmark">
                {
                  (playbackrate === rate && !usingCustomizedRate) 
                  && 
                  <i className="material-icons">check</i>
                }
              </div>
              <p className="playbackrate-num">{rate}</p>
            </span>
          </button>
        ))}

      </div>
    </div>
  )
} 

export default connectWithRedux(
  PlaybackrateMenu,
  ['playbackrate'],
  []
)