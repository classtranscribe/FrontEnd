import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import RootMenu from './RootMenu';
import PlaybackRateMenu from './PlaybackRateMenu';
import ClosedCaptionMenu from './ClosedCaptionMenu';
import './index.scss';

function SettingsMenu(props) {
  const {
    id,
    open = false,
    onClose,
    openCC,
    language,
    languages,
    playbackRate,
    playbackRates,
    onCloseCC,
    setLanguage,
    setPlaybackRate,
  } = props;

  const [menuType, setMenuType] = useState('root');
  const handleOpenMenu = type => () => {
    setMenuType(type);
  }

  useEffect(() => {
    setMenuType('root');
  }, [open])

  let menuElement = null;
  if (menuType === 'root') {
    let menuProps = {
      language,
      playbackRate,
      onOpenCCMenu: handleOpenMenu('cc'),
      openPlaybackRateMenu: handleOpenMenu('pbr')
    };

    menuElement = <RootMenu {...menuProps} />;
  } else if (menuType === 'pbr') {
    let menuProps = {
      playbackRate,
      playbackRates,
      onGoBack: handleOpenMenu('root'),
      setPlaybackRate
    };

    menuElement = <PlaybackRateMenu {...menuProps} />;
  } else if (menuType === 'cc') {
    let menuProps = {
      openCC,
      language,
      languages,
      onGoBack: handleOpenMenu('root'),
      onCloseCC,
      setLanguage
    };

    menuElement = <ClosedCaptionMenu {...menuProps} />;
  }

  const menuClasses = cx('ctp', 'menu', 'settings', { open });

  return open ? (
    <ClickAwayListener onClickAway={onClose}>
      <div id={id} role="menu" className={menuClasses} data-scroll="light">
        {menuElement}
      </div>
    </ClickAwayListener>
  ) : null;
}

SettingsMenu.propTypes = {
  id: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  openCC: PropTypes.bool.isRequired,
  language: ClosedCaptionMenu.propTypes.language.isRequired,
  languages: ClosedCaptionMenu.propTypes.languages.isRequired,
  playbackRate: PlaybackRateMenu.propTypes.playbackRate.isRequired,
  playbackRates: PlaybackRateMenu.propTypes.playbackRates.isRequired,
  onCloseCC: PropTypes.func.isRequired,
  setLanguage: PropTypes.func.isRequired,
  setPlaybackRate: PropTypes.func.isRequired,
};

export default SettingsMenu;

