import React from 'react';
import PropTypes from 'prop-types';
import { CTPlayerConstants as PConstants } from '../../../controllers';
import MenuItem from './MenuItem';

function CCOpacityMenu(props) {
  let {
    opacity,
    setCCOpacity,
    onGoBack
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="CC Background Opacity" onClick={onGoBack} />

      {PConstants.CCOpacities.map(_opac => (
        <MenuItem
          key={_opac}
          text={_opac}
          active={opacity === _opac}
          onClick={() => setCCOpacity(_opac)}
        />
      ))}
    </div>
  );
}

CCOpacityMenu.propTypes = {
  opacity: PropTypes.string.isRequired,
  setCCOpacity: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired
};

export default CCOpacityMenu;

