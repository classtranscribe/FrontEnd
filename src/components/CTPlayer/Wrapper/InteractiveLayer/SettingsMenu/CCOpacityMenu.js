import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerConstants as Constants } from '../../../controllers';
import MenuItem from './MenuItem';

function CCOpacityMenu(props) {
  let {
    ccOpacity,
    setCCOpacity,
    onGoBack
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="CC Background Opacity" onClick={onGoBack} />

      {Constants.CC_OPACITIES.map(opacity => (
        <MenuItem
          key={opacity}
          text={opacity}
          active={ccOpacity === opacity}
          onClick={() => setCCOpacity(opacity)}
        />
      ))}
    </div>
  );
}

CCOpacityMenu.propTypes = {
  ccOpacity: PropTypes.string.isRequired,
  setCCOpacity: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired
};

export default CCOpacityMenu;

