import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';

function LiveCaptionTrackSelection(props) {
  let {
    englishTrack,
    textTracks,
    onGoBack,
    setTextTrack,
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="Caption Tracks" onClick={onGoBack} />

      {textTracks.map(pbr => (
        <MenuItem
          key={pbr}
          text={pbr.language}
          active={pbr.language === englishTrack.language}
          onClick={() => setTextTrack(pbr)}
        />
      ))}
    </div>
  );
}


export default LiveCaptionTrackSelection;
