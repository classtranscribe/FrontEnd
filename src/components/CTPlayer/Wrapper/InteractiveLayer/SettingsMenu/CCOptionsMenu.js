import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';

function CCOptionsMenu(props) {
  let {
    ccFontSize,
    ccFontColor,
    ccOpacity,
    ccBackgroundColor,
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
        current={`${ccFontSize * 100 }%`}
        onClick={onOpenFontSizeMenu}
      />

      <MenuItem
        isSubMenu
        text="Font Color"
        current={ccFontColor}
        onClick={onOpenFontColorMenu}
      />

      <MenuItem
        isSubMenu
        text="Background Opacity"
        current={`${ccOpacity * 100 }%`}
        onClick={onOpenOpacityMenu}
      />

      <MenuItem
        isSubMenu
        text="Background Color"
        current={ccBackgroundColor}
        onClick={onOpenBackgroundColorMenu}
      />
    </div>
  );
}

CCOptionsMenu.propTypes = {
  ccFontSize: PropTypes.number.isRequired,
  ccFontColor: PropTypes.string.isRequired,
  ccOpacity: PropTypes.number.isRequired,
  ccBackgroundColor: PropTypes.string.isRequired,
  onGoBack: PropTypes.func.isRequired,
  onOpenFontSizeMenu: PropTypes.func.isRequired,
  onOpenFontColorMenu: PropTypes.func.isRequired,
  onOpenOpacityMenu: PropTypes.func.isRequired,
  onOpenBackgroundColorMenu: PropTypes.func.isRequired,
};

export default CCOptionsMenu;

