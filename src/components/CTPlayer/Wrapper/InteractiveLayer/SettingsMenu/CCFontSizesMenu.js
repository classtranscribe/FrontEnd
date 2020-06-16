import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerConstants as Constants } from '../../../controllers';
import MenuItem from './MenuItem';

function CCFontSizesMenu(props) {
  let {
    ccFontSize,
    setCCFontSize,
    onGoBack
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="CC Font Size" onClick={onGoBack} />

      {Constants.CC_FONT_SIZES.map(size => (
        <MenuItem
          key={size}
          text={size}
          active={ccFontSize === size}
          onClick={() => setCCFontSize(size)}
        />
      ))}
    </div>
  );
}

CCFontSizesMenu.propTypes = {
  ccFontSize: PropTypes.string.isRequired,
  setCCFontSize: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired
};

export default CCFontSizesMenu;

