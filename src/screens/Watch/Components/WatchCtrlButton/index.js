import React from 'react';
import { Popup } from 'semantic-ui-react';
import './index.scss';
import { isMobile } from 'react-device-detect';

export default function WatchCtrlButton({
  children,
  position = 'bottom',
  classNames = '',
  onClick = null,
  onDoubleClick = null,
  active = false,
  colored = false,
  disabled = false,
  label = '',
  ariaTags = {},
  popupStyle = {},
  popupPosition = '0, 15px',
  mouseEnterDelay = 0,
  id = '',
}) {
  const handleKeyDown = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  return (
    <Popup
      inverted
      wide
      basic
      style={popupStyle}
      position={`${position} center`}
      offset={position === 'bottom' ? popupPosition : undefined}
      mouseEnterDelay={mouseEnterDelay}
      openOnTriggerClick={false}
      openOnTriggerFocus
      closeOnTriggerBlur
      content={<strong>{label}</strong>}
      disabled={isMobile}
      trigger={
        <button
          id={id}
          className={`watch-ctrl-button ${classNames}`}
          active={active.toString()}
          colored={colored.toString()}
          disabled={disabled}
          position={position}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onKeyDown={handleKeyDown}
          {...ariaTags}
        >
          {children}
        </button>
      }
    />
  );
}
