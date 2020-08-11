import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerConstants as Constants } from '../../../controllers';
import MenuItem from './MenuItem';

function RootMenu(props) {
  const {
    isTwoScreen,
    screenMode,
    openCC,
    language,
    playbackRate,
    onOpenCCMenu,
    openPlaybackRateMenu,
    onOpenScreenModeManu
  } = props;

  const currentLang = !openCC ? 'OFF' : (language.text || 'OFF');

  return (
    <div className="ctp settings-menu">
      <MenuItem
        active
        isSubMenu
        text="Playback Rate"
        current={`${playbackRate }x`}
        onClick={openPlaybackRateMenu}
      />

      <MenuItem
        isSubMenu
        text="Closed Caption"
        current={currentLang}
        onClick={onOpenCCMenu}
      />

      {
        isTwoScreen
        &&
        <MenuItem
          isSubMenu
          text="Screen Mode"
          current={Constants.ScreenModesMap[screenMode]}
          onClick={onOpenScreenModeManu}
        />
      }
    </div>
  );
}

RootMenu.propTypes = {
  isTwoScreen: PropTypes.bool,
  screenMode: PropTypes.string,
  openCC: PropTypes.bool,
  language: PropTypes.shape({
    code: PropTypes.string,
    text: PropTypes.string
  }),
  playbackRate: PropTypes.number,
  onOpenCCMenu: PropTypes.func,
  openPlaybackRateMenu: PropTypes.func,
  onOpenScreenModeManu: PropTypes.func
};

export default RootMenu;

