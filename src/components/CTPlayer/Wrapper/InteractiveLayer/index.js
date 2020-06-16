import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { CTPlayerConstants as Constants } from '../../controllers';
import './index.scss';

import ActionBar from './ActionBar';
import ControlBar from './ControlBar';
import SettingsMenu from './SettingsMenu';

function InteractiveLayer(props) {
  let {
    hideWrapperOnMouseLeave,
    media,
    player,
    userReady,
    isEnded,
    isPaused,
    isFullscreen,
    duration,
    time,
    bufferedTime,
    muted,
    volume,
    playbackRate,
    openCC,
    language,
    currCaption,
  } = props;

  const [hover, setHover] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const handleOpenSettings = () => {
    setOpenSettings(true);
  }
  const handleCloseSettings = () => setOpenSettings(false);

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseMove = () => {
    if (player.mouseOverTimer !== null) {
      clearTimeout(player.mouseOverTimer);
      player.mouseOverTimer = null;
    }
    
    if (!hover) {
      setHover(true);
    }

    player.mouseOverTimer = setTimeout(() => {
      setHover(false);
      player.mouseOverTimer = null;
    }, 3000);
  }

  const handleMouseLeave = () => {
    if (hideWrapperOnMouseLeave) {
      setHover(false);
    }
  };

  const wrapperClasses = cx('ctp', 'wrapper', 'interact', {
    show: hover || isPaused || isEnded
  });

  const actionBarProps = {
    media,
    time,
  };

  const controlBarProps = {
    player,
    userReady,
    isEnded,
    isPaused,
    isFullscreen,
    duration,
    time,
    bufferedTime,
    muted,
    volume,
    playbackRate,
    openCC,
    currCaption,
    openSettings,
    onOpenSettings: handleOpenSettings
  };

  const settingsProps = {
    id: `ctp-settings-${player.id}`,
    open: openSettings,
    openCC,
    language,
    languages: player.languages,
    playbackRate,
    playbackRates: Constants.PLAYBACK_RATES,
    setPlaybackRate: player.setPlaybackRate,
    setLanguage: player.changeLanguage,
    onCloseCC: player.closeCC,
    onClose: handleCloseSettings
  };

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="ctp action-bar-con dismissible">
        <ActionBar {...actionBarProps} />
      </div>
      <div className="ctp ctrl-bar-con">
        <ControlBar {...controlBarProps} />
      </div>

      <SettingsMenu {...settingsProps} />
    </div>
  );
}

InteractiveLayer.propTypes = {

};

export default InteractiveLayer;

