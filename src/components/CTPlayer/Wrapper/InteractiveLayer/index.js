import React, { useState } from 'react';
import cx from 'classnames';
import './index.scss';
import ActionBar from './ActionBar';
import ControlBar from './ControlBar';
import SettingsMenu from './SettingsMenu';

function InteractiveLayer(props) {
  const {
    error,
    userActive,
    isEnded,
    isPaused,
    screenshotActionElement
  } = props;

  const [openSettings, setOpenSettings] = useState(false);

  const handleOpenSettings = () => {
    setOpenSettings(true);
  }
  const handleCloseSettings = () => setOpenSettings(false);

  const wrapperClasses = cx('ctp', 'wrapper', 'interact', {
    show: userActive || isPaused || isEnded || openSettings, // NOT IMPLEMENTED, TEMP
    static: Boolean(error)
  });
  // NOT IMPLEMENTED, MENU
  return (
    <div
      className={wrapperClasses}
    // onMouseEnter={handleMouseEnter}
    // onMouseMove={handleMouseMove}
    // onMouseLeave={handleMouseLeave}
    >
      <div className="ctp action-bar-con dismissible">
        <ActionBar
          screenshotActionElement={screenshotActionElement}
        />
      </div>
      {
        !error
        &&
        <>
          <div className="ctp ctrl-bar-con">
            <ControlBar />
          </div>
          <SettingsMenu 
            onClose={handleCloseSettings}
          />
        </>
      }
    </div>
  );
}

export default InteractiveLayer;

