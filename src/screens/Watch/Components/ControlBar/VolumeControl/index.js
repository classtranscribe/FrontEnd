import { connect } from 'dva';
import React from 'react';
import { Popup } from 'semantic-ui-react';
import './index.scss';
import './slider.scss';

function VolumeControl({ muted = false, volume = true, dispatch }) {
  const handleVolumeChange = ({ target: { value } }) => {
    if (muted) {
      dispatch({type: 'watch/media_mute', payload: false})
    }
    dispatch({type: 'watch/media_volume', payload: value})

    if (value < 0.04) {
      dispatch({type: 'watch/media_mute', payload: true})
    }
  };

  const handleButtonClick = () => {
    dispatch({type: 'watch/media_mute'})
  };

  const handleVolumeKeyDown = (e) => {
    const { keyCode } = e;
    if (keyCode === 37 || keyCode === 39) {
      e.preventDefault();
    }
  };

  const iconName =
    muted || volume < 0.04 ? 'volume_off' : volume >= 0.5 ? 'volume_up' : 'volume_down';

  return (
    <div className="watch-volume-ctrl">
      <Popup
        inverted
        wide
        basic
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

      <Popup
        inverted
        wide
        basic
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
            value={muted ? 0 : volume}
            onKeyDown={handleVolumeKeyDown}
            onChange={handleVolumeChange}
          />
        }
      />
    </div>
  );
}

export default connect(({ playerpref, loading }) => ({
  muted: playerpref.muted, volume: playerpref.volume
}))(VolumeControl);
