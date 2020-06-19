import React from 'react';
import PropTypes from 'prop-types';
import { CTCheckbox } from 'layout';
import { setup } from '../../../controllers';

function InstModeCheckBox(props) {
  let { isInstMode } = props;

  const handleCheckboxChange = ({ target: { checked }}) => {
    setup.setIsInstMode(checked);
  };

  return (
    <CTCheckbox 
      label="Instructor Mode" 
      checked={isInstMode}
      onChange={handleCheckboxChange}
    />
  );
}

InstModeCheckBox.propTypes = {

};

export default InstModeCheckBox;

