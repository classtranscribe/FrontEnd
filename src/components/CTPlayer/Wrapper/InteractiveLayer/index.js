import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { CTPlayerConstants as Constants, CTPlayerController } from '../../controllers';
import './index.scss';

import ActionBar from './ActionBar';
import ControlBar from './ControlBar';
import SettingsMenu from './SettingsMenu';

function InteractiveLayer(props) {
  const {
    error,
    media,
    player,
    isTwoScreen,
    screenMode,
    userReady,
    userActive,
    isEnded,
    isPaused,
    isFullscreen,
    duration,
    beginAt,
    endAt,
    time,
    bufferedTime,
    muted,
    volume,
    playbackRate,
    openCC,
    ccStyle,
    language,
    currCaption,
    screenshotActionElement
  } = props;

  const [openSettings, setOpenSettings] = useState(false);

  const handleOpenSettings = () => {
    setOpenSettings(true);
  }
  const handleCloseSettings = () => setOpenSettings(false);

  const wrapperClasses = cx('ctp', 'wrapper', 'interact', {
    show: userActive || isPaused || isEnded || openSettings,
    static: Boolean(error)
  });

  const actionBarProps = {
    error,
    media,
    userReady,
    player,
    time,
    screenshotActionElement
  };

  const controlBarProps = {
    player,
    isTwoScreen,
    userReady,
    isEnded,
    isPaused,
    isFullscreen,
    beginAt,
    endAt,
    duration,
    time,
    bufferedTime,
    muted,
    volume,
    openCC,
    ccStyle,
    currCaption,
    openSettings,
    onOpenSettings: handleOpenSettings
  };

  const settingsProps = {
    id: `ctp-settings-${player.id}`,
    open: openSettings,
    isTwoScreen,
    screenMode,
    openCC,
    ccStyle,
    setCCFontSize: player.setCCFontSize,
    setCCFontColor: player.setCCFontColor,
    setCCOpacity: player.setCCOpacity,
    setCCBackgroundColor: player.setCCBackgroundColor,
    language,
    languages: player.languages,
    playbackRate,
    onClose: handleCloseSettings,
    playbackRates: Constants.PlaybackRates,
    setPlaybackRate: player.setPlaybackRate,
    setLanguage: player.changeLanguage,
    onCloseCC: player.closeCC,
    setScreenMode: player.setScreenMode,
    onSwapScreens: player.swapScreens,
  };

  return (
    <div
      className={wrapperClasses}
      // onMouseEnter={handleMouseEnter}
      // onMouseMove={handleMouseMove}
      // onMouseLeave={handleMouseLeave}
    >
      <div className="ctp action-bar-con dismissible">
        <ActionBar {...actionBarProps} />
      </div>
      {
        !error
        &&
        <>
          <div className="ctp ctrl-bar-con">
            <ControlBar {...controlBarProps} />
          </div>

          <SettingsMenu {...settingsProps} />
        </>
      }
    </div>
  );
}

InteractiveLayer.propTypes = {
  media: PropTypes.object,
  player: PropTypes.instanceOf(CTPlayerController),
  isTwoScreen: PropTypes.bool,
  screenMode: PropTypes.string,
  userReady: PropTypes.bool,
  isEnded: PropTypes.bool,
  isPaused: PropTypes.bool,
  isFullscreen: PropTypes.bool,
  duration: PropTypes.number,
  time: PropTypes.number,
  bufferedTime: PropTypes.number,
  muted: PropTypes.bool,
  volume: PropTypes.number,
  playbackRate: SettingsMenu.propTypes.playbackRate,
  openCC: SettingsMenu.propTypes.openCC,
  ccStyle: ControlBar.propTypes.ccStyle,
  language: SettingsMenu.propTypes.language,
  currCaption: ControlBar.propTypes.currCaption,
  hideWrapperOnMouseLeave: PropTypes.bool,
};

export default InteractiveLayer;

