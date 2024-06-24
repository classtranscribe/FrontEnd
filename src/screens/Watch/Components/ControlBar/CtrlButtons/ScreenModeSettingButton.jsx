import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import WatchCtrlButton from '../../WatchCtrlButton';
import {
  screenModes,
  MENU_SCREEN_MODE,
  NORMAL_MODE,
} from '../../../Utils';

export function ScreenModeSettingButtonWithRedux({ mode = NORMAL_MODE, dispatch, menu }) {
  const handleMenuTrigger = () => {
    if (menu !== MENU_SCREEN_MODE) {
      dispatch({type: 'watch/menu_open', payload: { type: MENU_SCREEN_MODE } });
    } else {
      dispatch({type: 'watch/menu_close'});
    }
  };

  const currMode = _.find(screenModes, { type: mode });
  return currMode ? (
    <WatchCtrlButton
      onClick={handleMenuTrigger}
      active={menu === MENU_SCREEN_MODE}
      label={
        <>
          Screen Mode: <strong>{currMode.name}</strong> (SHIFT+M)
        </>
      }
      id={MENU_SCREEN_MODE}
      ariaTags={{
        'aria-label': 'Screen Mode Menu',
        // 'aria-keyshortcuts': 'SHIFT+M',
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

export const ScreenModeSettingButton = connect(({ watch: { menu, mode, isFullscreen } }) => ({
  menu, mode, isFullscreen
}))(ScreenModeSettingButtonWithRedux);
