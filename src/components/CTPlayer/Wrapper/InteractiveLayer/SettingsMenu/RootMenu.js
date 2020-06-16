import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';

function RootMenu(props) {
  let {
    openCC,
    language,
    playbackRate,
    onOpenCCMenu,
    openPlaybackRateMenu
  } = props;

  const currentLang = !openCC ? 'OFF' : (language.text || 'OFF');

  return (
    <div className="ctp settings-menu">
      <MenuItem
        isSubMenu
        active
        text="Closed Caption"
        current={currentLang}
        onClick={onOpenCCMenu}
      />

      <MenuItem
        isSubMenu
        text="Playback Rate"
        current={`${playbackRate }x`}
        onClick={openPlaybackRateMenu}
      />
    </div>
  );
}

RootMenu.propTypes = {
  openCC: PropTypes.bool,
  language: PropTypes.shape({
    code: PropTypes.string,
    text: PropTypes.string
  }),
  playbackRate: PropTypes.number,
  onOpenCCMenu: PropTypes.func,
  openPlaybackRateMenu: PropTypes.func
};

export default RootMenu;

