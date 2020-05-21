import React from 'react';
import WatchCtrlButton from '../../WatchCtrlButton';
import { connectWithRedux, menuControl, MENU_HIDE, MENU_SETTING } from '../../../Utils';

export function SettingButtonWithRedux({ menu = MENU_HIDE }) {
  const handleMenuTrigger = () => {
    if (menu !== MENU_SETTING) {
      menuControl.open(MENU_SETTING);
    } else {
      menuControl.close();
    }
  };

  return (
    <WatchCtrlButton
      onClick={handleMenuTrigger}
      active={menu === MENU_SETTING}
      label="Settings"
      id={MENU_SETTING}
      ariaTags={{
        'aria-label': 'Setting Menu',
        // 'aria-keyshortcuts': 'SHIFT+C',
        'aria-controls': 'watch-setting-menu',
        'aria-expanded': menu === MENU_SETTING ? 'false' : 'true',
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i type="setting" className="fas fa-cog" />
      </span>
    </WatchCtrlButton>
  );
}

export const SettingButton = connectWithRedux(SettingButtonWithRedux, ['menu']);
