import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import WatchCtrlButton from '../../WatchCtrlButton';
import {
  screenModes,
  MENU_HIDE,
  MENU_SCREEN_MODE,
  NORMAL_MODE,
} from '../../../Utils';

export function ScreenModeSettingButtonWithRedux({ isFullscreen = false, mode = NORMAL_MODE, dispatch, menu }) {
  const handleMenuTrigger = () => {
    if (isFullscreen === false) {
      dispatch({type: 'watch/setFullscreen', payload: true });
    } else {
      dispatch({type: 'watch/setFullscreen', payload: false });
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

export const ScreenModeSettingButton = connect(({ watch: { menu, mode, isFullscreen }, loading }) => ({
  menu, mode, isFullscreen
}))(ScreenModeSettingButtonWithRedux);
