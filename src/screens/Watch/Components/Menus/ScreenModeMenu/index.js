import React from 'react';
import { connectWithRedux, screenModes, NORMAL_MODE } from '../../../Utils';
import './index.scss';

function ScreenModeMenu({ mode = NORMAL_MODE, onClose = null, media = {}, dispatch }) {
  const handleChooseMode = (mode_) => () => {
    dispatch({ type: 'watch/setWatchMode', payload: { mode: mode_ } });
    setTimeout(() => onClose(), 200);
  };

  const { isTwoScreen } = media;

  return (
    <div
      id="watch-screen-mode-menu"
      role="menu"
      aria-label="Screen Mode Menu"
      className="watch-general-menu"
    >
      <button
        className="plain-btn watch-menu-close-btn watch-screenmode-menu-close-btn"
        onClick={onClose}
      >
        <i className="material-icons">close</i>
      </button>
      <div className="watch-icon-list" data-2screen={isTwoScreen ? 'true' : 'false'}>
        {screenModes.map((screenMode) => (
          <button
            key={screenMode.type}
            mode={screenMode.type}
            className="plain-btn watch-icon-listitem"
            aria-label={screenMode.name}
            active={Boolean(mode === screenMode.type).toString()}
            onClick={handleChooseMode(screenMode.type)}
            role="menuitem"
          >
            <span tabIndex="-1">
              <div className="watch-icon-listitem-checkmark">
                {mode === screenMode.type && <i className="material-icons">check</i>}
              </div>
              <i className="material-icons watch-icon-icon">{screenMode.icon}</i>
              <div className="watch-icon-name">{screenMode.name}</div>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default connectWithRedux(ScreenModeMenu, ['mode', 'media']);
