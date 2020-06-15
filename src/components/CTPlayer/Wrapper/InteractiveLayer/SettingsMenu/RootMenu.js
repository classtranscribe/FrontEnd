import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';

function RootMenu(props) {
  let {
    language,
    playbackRate,
    onOpenCCMenu,
    openPlaybackRateMenu
  } = props;
  return (
    <div className="ctp settings-menu">
      <MenuItem
        isSubMenu
        active
        text="Closed Caption"
        current={language.text || 'OFF'}
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
  language: PropTypes.shape({
    code: PropTypes.string,
    text: PropTypes.string
  }),
  playbackRate: PropTypes.number,
  onOpenCCMenu: PropTypes.func,
  openPlaybackRateMenu: PropTypes.func
};

export default RootMenu;

