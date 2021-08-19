import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerConstants as Constants } from '../../../controllers';
import MenuItem from './MenuItem';

function RootMenu(props) {
  let {
    live,
    isTwoScreen,
    screenMode,
    openCC,
    language,
    playbackRate,
    onOpenCCMenu,
    openPlaybackRateMenu,
    openLiveCaptionMenu,
    onOpenScreenModeManu,
    fontSize,
    onOpenLiveTextTrackSelection,
    englishTrack,
    onOpenScreenModeMenu,
    onOpenCCSettingMenu,
  } = props;

  let currentLang;
  if (openCC && language && language.text) {
    currentLang = language.text;
  } else {
    currentLang = 'OFF';
  }

  if (fontSize == null) fontSize = "normal";
  // const cl = !openCC ? 'OFF' : (language.text || 'OFF');

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
        active
        isSubMenu
        text="Caption Language"
        current={englishTrack.language}
        onClick={onOpenLiveTextTrackSelection}
      />

      {
        live
        &&
        (
          <div>
            <MenuItem
              active
              isSubMenu
              text="Live Caption Font Size"
              current={`${fontSize}`}
              onClick={openLiveCaptionMenu}
            />
          </div>
        )
      }

      {
        isTwoScreen
        &&
        <MenuItem
          isSubMenu
          text="Screen Mode"
          current={Constants.ScreenModesMap[screenMode]}
          onClick={onOpenScreenModeMenu}
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
  openLiveCaptionMenu: PropTypes.func,
  onOpenScreenModeManu: PropTypes.func,
  fontSize: PropTypes.string,
};

export default RootMenu;

/*
      <MenuItem
        isSubMenu
        text="Closed Caption"
        current={currentLang}
        onClick={onOpenCCMenu}
      />
      NOT IMPLEMENTED
*/