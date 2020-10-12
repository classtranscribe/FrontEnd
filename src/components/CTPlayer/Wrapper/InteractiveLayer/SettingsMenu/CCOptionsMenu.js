import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';

function CCOptionsMenu(props) {
  let {
    fontSize,
    fontColor,
    opacity,
    backgroundColor,
    onGoBack,
    onOpenFontSizeMenu,
    onOpenFontColorMenu,
    onOpenOpacityMenu,
    onOpenBackgroundColorMenu,
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="CC Custom" onClick={onGoBack} />

      <MenuItem
        isSubMenu
        active
        text="Font Size"
        current={`${fontSize * 100 }%`}
        onClick={onOpenFontSizeMenu}
      />

      <MenuItem
        isSubMenu
        text="Font Color"
        current={fontColor}
        onClick={onOpenFontColorMenu}
      />

      <MenuItem
        isSubMenu
        text="Background Opacity"
        current={`${opacity * 100 }%`}
        onClick={onOpenOpacityMenu}
      />

      <MenuItem
        isSubMenu
        text="Background Color"
        current={backgroundColor}
        onClick={onOpenBackgroundColorMenu}
      />
    </div>
  );
}

CCOptionsMenu.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontColor: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  onGoBack: PropTypes.func.isRequired,
  onOpenFontSizeMenu: PropTypes.func.isRequired,
  onOpenFontColorMenu: PropTypes.func.isRequired,
  onOpenOpacityMenu: PropTypes.func.isRequired,
  onOpenBackgroundColorMenu: PropTypes.func.isRequired,
};

export default CCOptionsMenu;

