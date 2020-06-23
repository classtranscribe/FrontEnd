import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerConstants as Constants } from '../../../controllers';
import MenuItem from './MenuItem';

function CCBackgroundColorsMenu(props) {
  let {
    ccBackgroundColor,
    setCCBackgroundColor,
    onGoBack
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="CC Background Color" onClick={onGoBack} />

      {Constants.CC_COLORS.map(color => (
        <MenuItem
          key={color}
          text={color}
          active={ccBackgroundColor === color}
          onClick={() => setCCBackgroundColor(color)}
        />
      ))}
    </div>
  );
}

CCBackgroundColorsMenu.propTypes = {
  ccBackgroundColor: PropTypes.string.isRequired,
  setCCBackgroundColor: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired
};

export default CCBackgroundColorsMenu;

