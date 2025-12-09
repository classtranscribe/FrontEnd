import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { CTPopoverLabel, altEl } from 'layout';

function ToolButton({ onClick, icon, label, shortcut, anchorRef, active, ...otherProps }) {
  const fullLabel = shortcut ? `${label} (${shortcut})` : label;
  const buttonClassName = active
    ? 'ct-epb toolbar-btn icon-btn active'
    : 'ct-epb toolbar-btn icon-btn';
  const buttonClassNameText = active ? 'ct-epb toolbar-btn active' : 'ct-epb toolbar-btn';

  // Remove active from otherProps to prevent passing it to Material-UI components
  const { active: _, ...propsWithoutActive } = otherProps;

  return (
    <CTPopoverLabel label={fullLabel}>
      {icon ? (
        <IconButton
          onClick={onClick}
          id={`ct-epb-h-toolbth-${icon}`}
          className={buttonClassName}
          aria-label={fullLabel}
          disableRipple
          ref={anchorRef}
          {...propsWithoutActive}
        >
          <span className="ct-epb toolbar-btn-inner" tabIndex="-1">
            <span className="material-icons">{icon}</span>
          </span>
        </IconButton>
      ) : (
        <Button
          onClick={onClick}
          className={buttonClassNameText}
          aria-label={fullLabel}
          disableRipple
          endIcon={<span className="material-icons">arrow_drop_down</span>}
          ref={anchorRef}
          {...propsWithoutActive}
        >
          <span className="ct-epb toolbar-btn-inner" tabIndex="-1">
            {label}
          </span>
        </Button>
      )}
    </CTPopoverLabel>
  );
}

export const ToolButtonDivider = () => (
  <div className="ct-epb toolbar-btn-divider ct-pointer-event-none" aria-hidden="true" />
);

export default ToolButton;

export const _makeTBtn = (icon, label, shortcut, onClick, active, use, otherProps) =>
  altEl(ToolButton, use, { icon, onClick, shortcut, label, active, ...otherProps });
