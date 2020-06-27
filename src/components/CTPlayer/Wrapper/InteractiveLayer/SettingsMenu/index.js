import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import RootMenu from './RootMenu';
import PlaybackRateMenu from './PlaybackRateMenu';
import ClosedCaptionMenu from './ClosedCaptionMenu';
import CCOptionsMenu from './CCOptionsMenu';
import CCFontSizesMenu from './CCFontSizesMenu';
import CCFontColorsMenu from './CCFontColorsMenu';
import CCOpacityMenu from './CCOpacityMenu';
import CCBackgroundColorsMenu from './CCBackgroundColorsMenu';
import ScreenModesMenu from './ScreenModesMenu';
import './index.scss';

function SettingsMenu(props) {
  const {
    id,
    open = false,
    isTwoScreen,
    screenMode,
    openCC,
    ccFontSize,
    ccFontColor,
    ccOpacity,
    ccBackgroundColor,
    language,
    languages,
    playbackRate,
    playbackRates,
    onClose,
    setScreenMode,
    onSwapScreens,
    onCloseCC,
    setLanguage,
    setPlaybackRate,
    setCCFontSize,
    setCCFontColor,
    setCCOpacity,
    setCCBackgroundColor,
  } = props;

  const [menuType, setMenuType] = useState('root');
  const handleOpenMenu = type => () => {
    setMenuType(type);
  };

  useEffect(() => {
    setMenuType('root');
  }, [open]);

  let menuElement = null;
  let menuProps = {};

  switch (menuType) {
    case 'root':
      menuProps = {
        isTwoScreen,
        screenMode,
        openCC,
        language,
        playbackRate,
        onOpenCCMenu: handleOpenMenu('cc'),
        openPlaybackRateMenu: handleOpenMenu('pbr'),
        onOpenScreenModeManu: handleOpenMenu('screen-mode')
      };
      menuElement = <RootMenu {...menuProps} />;
      break;

    case 'pbr':
      menuProps = {
        playbackRate,
        playbackRates,
        onGoBack: handleOpenMenu('root'),
        setPlaybackRate
      };
      menuElement = <PlaybackRateMenu {...menuProps} />;
      break;

    case 'cc':
      menuProps = {
        openCC,
        language,
        languages,
        onGoBack: handleOpenMenu('root'),
        onOpenCCOptions: handleOpenMenu('cc-opt'),
        onCloseCC,
        setLanguage
      };
      menuElement = <ClosedCaptionMenu {...menuProps} />;
      break;

    case 'cc-opt':
      menuProps = {
        ccFontSize,
        ccFontColor,
        ccOpacity,
        ccBackgroundColor,
        onGoBack: handleOpenMenu('cc'),
        onOpenFontSizeMenu: handleOpenMenu('cc-f-size'),
        onOpenFontColorMenu: handleOpenMenu('cc-f-color'),
        onOpenOpacityMenu: handleOpenMenu('cc-opacity'),
        onOpenBackgroundColorMenu: handleOpenMenu('cc-bg-color'),
      };
      menuElement = <CCOptionsMenu {...menuProps} />;
      break;

    case 'cc-f-size':
      menuProps = {
        ccFontSize,
        setCCFontSize,
        onGoBack: handleOpenMenu('cc-opt')
      };
      menuElement = <CCFontSizesMenu {...menuProps} />;
      break;

    case 'cc-f-color':
      menuProps = {
        ccFontColor,
        setCCFontColor,
        onGoBack: handleOpenMenu('cc-opt')
      };
      menuElement = <CCFontColorsMenu {...menuProps} />;
      break;

    case 'cc-opacity':
      menuProps = {
        ccOpacity,
        setCCOpacity,
        onGoBack: handleOpenMenu('cc-opt')
      };
      menuElement = <CCOpacityMenu {...menuProps} />;
      break;

    case 'cc-bg-color':
      menuProps = {
        ccBackgroundColor,
        setCCBackgroundColor,
        onGoBack: handleOpenMenu('cc-opt')
      };
      menuElement = <CCBackgroundColorsMenu {...menuProps} />;
      break;

    case 'screen-mode':
      menuProps = {
        screenMode,
        setScreenMode,
        onSwapScreens,
        onGoBack: handleOpenMenu('root')
      };
      menuElement = <ScreenModesMenu {...menuProps} />
      break;

    default:
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
  open: PropTypes.bool,
  isTwoScreen: PropTypes.bool,
  screenMode: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  openCC: PropTypes.bool.isRequired,
  ccFontSize: PropTypes.number.isRequired,
  ccFontColor: PropTypes.string.isRequired,
  ccOpacity: PropTypes.number.isRequired,
  ccBackgroundColor: PropTypes.string.isRequired,
  language: ClosedCaptionMenu.propTypes.language,
  languages: ClosedCaptionMenu.propTypes.languages,
  playbackRate: PlaybackRateMenu.propTypes.playbackRate,
  playbackRates: PlaybackRateMenu.propTypes.playbackRates,
  setScreenMode: PropTypes.func,
  onSwapScreens: PropTypes.func,
  onCloseCC: PropTypes.func.isRequired,
  setLanguage: PropTypes.func.isRequired,
  setPlaybackRate: PropTypes.func.isRequired,
  setCCFontSize: PropTypes.func.isRequired,
  setCCFontColor: PropTypes.func.isRequired,
  setCCOpacity: PropTypes.func.isRequired,
  setCCBackgroundColor: PropTypes.func.isRequired,
};

export default SettingsMenu;

