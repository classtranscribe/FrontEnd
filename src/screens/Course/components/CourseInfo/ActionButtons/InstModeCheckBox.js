import React from 'react';
import { CTCheckbox } from 'layout';
import { setup } from '../../../controllers';

function InstModeCheckBox({
  isInstMode
}) {
  const handleCheckboxChange = ({ target: { checked }}) => {
    setup.setIsInstMode(checked);
  };

  return (
    <CTCheckbox 
      label="Course admin mode" 
      checked={isInstMode}
      onChange={handleCheckboxChange}
    />
  );
}

export default InstModeCheckBox;

