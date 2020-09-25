import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerConstants as PConstants } from '../../../controllers';
import MenuItem from './MenuItem';

function CCBackgroundColorsMenu(props) {
  let {
    backgroundColor,
    setCCBackgroundColor,
    onGoBack
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="CC Background Color" onClick={onGoBack} />

      {PConstants.CCColors.map(color => (
        <MenuItem
          key={color}
          text={color}
          active={backgroundColor === color}
          onClick={() => setCCBackgroundColor(color)}
        />
      ))}
    </div>
  );
}

CCBackgroundColorsMenu.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  setCCBackgroundColor: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired
};

export default CCBackgroundColorsMenu;

