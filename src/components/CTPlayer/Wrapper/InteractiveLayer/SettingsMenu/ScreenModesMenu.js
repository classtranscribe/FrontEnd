import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerConstants as Constants } from '../../../controllers';
import MenuItem from './MenuItem';

function ScreenModesMenu(props) {
  const {
    screenMode,
    setScreenMode,
    onSwapScreens,
    onGoBack
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="Screen Mode" onClick={onGoBack} />

      <MenuItem
        bordered
        text="Swap Screens"
        onClick={onSwapScreens}
      />

      {[Constants.SCREEN_NORMAL, Constants.SCREEN_NEST].map(mode => (
        <MenuItem
          key={mode}
          active={screenMode === mode}
          text={Constants.SCREEN_MODES_MAP[mode]}
          onClick={() => setScreenMode(mode)}
        />
      ))}
    </div>
  )
}

ScreenModesMenu.propTypes = {
  screenMode: PropTypes.string,
  setScreenMode: PropTypes.func,
  onSwapScreens: PropTypes.func,
  onGoBack: PropTypes.func
};

export default ScreenModesMenu;

