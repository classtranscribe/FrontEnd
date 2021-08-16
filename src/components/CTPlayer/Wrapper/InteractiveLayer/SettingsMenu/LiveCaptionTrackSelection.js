import React from 'react';
import PropTypes from 'prop-types';
import { INDEX_HTML_LIVE } from 'screens/EPub/controllers/file-builders/file-templates/html';
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

      {textTracks.map((pbr, index) => (
        <MenuItem
          key={pbr}
          text={pbr.language}
          active={pbr.language === englishTrack.language}
          onClick={() => setTextTrack(index)}
        />
      ))}
    </div>
  );
}


export default LiveCaptionTrackSelection;
