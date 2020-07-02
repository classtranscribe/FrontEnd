import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerConstants as Constants } from '../../../controllers';
import MenuItem from './MenuItem';

function CCFontColorsMenu(props) {
  let {
    ccFontColor,
    setCCFontColor,
    onGoBack
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="CC Font Color" onClick={onGoBack} />

      {Constants.CC_COLORS.map(color => (
        <MenuItem
          key={color}
          text={color}
          active={ccFontColor === color}
          onClick={() => setCCFontColor(color)}
        />
      ))}
    </div>
  );
}

CCFontColorsMenu.propTypes = {
  ccFontColor: PropTypes.string.isRequired,
  setCCFontColor: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired
};

export default CCFontColorsMenu;

