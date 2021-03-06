import React from 'react';
import { connect } from 'dva';
import WatchCtrlButton from '../../WatchCtrlButton';
import { MENU_HIDE, MENU_SETTING } from '../../../Utils';

export function SettingButtonWithRedux({ menu = MENU_HIDE, dispatch }) {
  const handleMenuTrigger = () => {
    if (menu !== MENU_SETTING) {
      dispatch({type: 'watch/menu_open', payload: { type: MENU_SETTING } });
    } else {
      dispatch({type: 'watch/menu_close'});
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

export const SettingButton = connect(({ watch: { menu }, loading }) => ({
  menu
}))(SettingButtonWithRedux);
