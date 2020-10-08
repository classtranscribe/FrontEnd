import React from 'react';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';
import ActionButton from '../../ActionButton';
import SliderTimeLabel from '../Progress/SliderTimeLabel';
import './index.scss';

function Volume(props) {
  let { 
    volume, 
    muted, 
    onToggleMute, 
    onVolumeChange 
  } = props;

  let volIcon = 'volume_up';
  if (muted) {
    volIcon = 'volume_off';
  } else if (volume < 0.5) {
    volIcon = 'volume_down';
  }

  const handleVolumeChange = (e, newVolume) => {
    if (typeof onVolumeChange === 'function') {
      onVolumeChange(newVolume);
    }
  };

  const valueLabelFormat = (_value) => {
    return `${Math.floor(_value * 100) }%`;
  };

  return (
    <div className="ctp volume-con">
      <ActionButton
        icon={volIcon}
        label={muted ? "Unmute" : "Mute"}
        onClick={onToggleMute}
      />

      <div className="ctp volume-slider">
        <Slider 
          step={0.05} 
          value={volume} 
          onChange={handleVolumeChange} 
          ValueLabelComponent={SliderTimeLabel}
          valueLabelFormat={valueLabelFormat}
          aria-label="Volume Slider" 
          min={0}
          max={1}
        />
      </div>
    </div>
  );
}

Volume.propTypes = {
  volume: PropTypes.number, 
  muted: PropTypes.bool, 
  onToggleMute: PropTypes.func, 
  onVolumeChange: PropTypes.func
};

export default Volume;

