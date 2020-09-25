import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerConstants as PConstants } from '../../../controllers';
import MenuItem from './MenuItem';

function CCFontSizesMenu(props) {
  let {
    fontSize,
    setCCFontSize,
    onGoBack
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="CC Font Size" onClick={onGoBack} />

      {PConstants.CCFontSizes.map(size => (
        <MenuItem
          key={size}
          text={`${size * 100 }%`}
          active={fontSize === size}
          onClick={() => setCCFontSize(size)}
        />
      ))}
    </div>
  );
}

CCFontSizesMenu.propTypes = {
  fontSize: PropTypes.string.isRequired,
  setCCFontSize: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired
};

export default CCFontSizesMenu;

