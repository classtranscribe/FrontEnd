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


export default PlaybackRateMenu;
