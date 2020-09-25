import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerConstants as PConstants } from '../../../controllers';
import MenuItem from './MenuItem';

function CCFontColorsMenu(props) {
  let {
    fontColor,
    setCCFontColor,
    onGoBack
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="CC Font Color" onClick={onGoBack} />

      {PConstants.CCColors.map(color => (
        <MenuItem
          key={color}
          text={color}
          active={fontColor === color}
          onClick={() => setCCFontColor(color)}
        />
      ))}
    </div>
  );
}

CCFontColorsMenu.propTypes = {
  fontColor: PropTypes.string.isRequired,
  setCCFontColor: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired
};

export default CCFontColorsMenu;

