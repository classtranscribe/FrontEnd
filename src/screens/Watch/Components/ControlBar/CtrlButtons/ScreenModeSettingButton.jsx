import React from 'react';
import _ from 'lodash';
import WatchCtrlButton from '../../WatchCtrlButton';
import {
  connectWithRedux,
  screenModes,
  menuControl,
  MENU_HIDE,
  MENU_SCREEN_MODE,
  NORMAL_MODE,
} from '../../../Utils';

export function ScreenModeSettingButtonWithRedux({ menu = MENU_HIDE, mode = NORMAL_MODE }) {
  const handleMenuTrigger = () => {
    if (menu !== MENU_SCREEN_MODE) {
      menuControl.open(MENU_SCREEN_MODE);
    } else {
      menuControl.close();
    }
  };

  const currMode = _.find(screenModes, { type: mode });
  return currMode ? (
    <WatchCtrlButton
      onClick={handleMenuTrigger}
      active={menu === MENU_SCREEN_MODE}
      label={
        <>
          Screen Mode: <strong>{currMode.name}</strong> (SHIFT+S)
        </>
      }
      id={MENU_SCREEN_MODE}
      ariaTags={{
        'aria-label': 'Screen Mode Menu',
        // 'aria-keyshortcuts': 'SHIFT+S',
        'aria-controls': 'watch-screen-mode-menu',
        'aria-expanded': menu === MENU_SCREEN_MODE ? 'false' : 'true',
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">{currMode.icon}</i>
      </span>
    </WatchCtrlButton>
  ) : null;
}

export const ScreenModeSettingButton = connectWithRedux(ScreenModeSettingButtonWithRedux, [
  'menu',
  'mode',
]);
