import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';

function PlaybackRateMenu(props) {
  let {
    playbackRate,
    playbackRates,
    onGoBack,
    setPlaybackRate
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="Playback Rate" onClick={onGoBack} />

      {playbackRates.map(pbr => (
        <MenuItem
          key={pbr}
          text={pbr.toString()}
          active={pbr === playbackRate}
          onClick={() => setPlaybackRate(pbr)}
        />
      ))}
    </div>
  );
}

PlaybackRateMenu.propTypes = {
  playbackRate: PropTypes.number,
  playbackRates: PropTypes.arrayOf(PropTypes.number),
  onGoBack: PropTypes.func,
  setPlaybackRate: PropTypes.func
};

export default PlaybackRateMenu;
