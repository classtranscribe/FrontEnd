import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { connect } from 'dva'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import {
  CTPlayerConstants as PConstants,
  LanguageConstants as LangConstants
} from 'components/CTPlayer';
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
    menu,
    onClose,
    playbackrate: playbackRate,
    media,
    openCC,
    currTrans,
    dispatch
  } = props;
  const open = menu && menu === 'menu-setting';
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
        playbackRate,
        openCC,
        language: currTrans.language,
        onOpenCCMenu: handleOpenMenu('cc'),
        openPlaybackRateMenu: handleOpenMenu('pbr'),
        onOpenScreenModeManu: handleOpenMenu('screen-mode')
      }
      menuElement = <RootMenu {...menuProps} />;
      break;

    case 'pbr':
      menuProps = {
        playbackRate,
        playbackRates: PConstants.PlaybackRates,
        onGoBack: handleOpenMenu('root'),
        setPlaybackRate: (value) => dispatch({ type: 'watch/media_playbackrate', payload: value })
      }
      menuElement = <PlaybackRateMenu {...menuProps} />;
      break;

    case 'cc':
      menuProps = {
        onCloseCC: (value) => dispatch({ type: 'playerpref/toggleOpenCC', payload: value }),
        openCC,
        language: { code: currTrans.language },
        languages: LangConstants.LanguageOptions,
        onGoBack: handleOpenMenu('root'),
        // onOpenCCOptions: handleOpenMenu('cc-opt'),
        setLanguage: (value) => dispatch({ type: 'watch/setLanguage', payload: value })
      }
      menuElement = <ClosedCaptionMenu {...menuProps} />;
      break;

    case 'cc-opt':
      menuElement = <CCOptionsMenu {...menuProps} />;
      break;

    case 'cc-f-size':
      menuElement = <CCFontSizesMenu {...menuProps} />;
      break;

    case 'cc-f-color':
      menuElement = <CCFontColorsMenu {...menuProps} />;
      break;

    case 'cc-opacity':
      menuElement = <CCOpacityMenu {...menuProps} />;
      break;

    case 'cc-bg-color':
      menuElement = <CCBackgroundColorsMenu {...menuProps} />;
      break;

    case 'screen-mode':
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


export default connect(({ watch: { menu, media, currTrans },
  playerpref: { playbackrate, openCC } }) => ({
    menu, media, currTrans, playbackrate, openCC
  }))(SettingsMenu);

