import React from 'react';
import { CTSwitch } from 'layout';
import { setup } from '../../../controllers';

function InstModeCheckBox({
  isInstMode
}) {
  const handleCheckboxChange = ({ target: { checked }}) => {
    setup.setIsInstMode(checked);
  };

  return (
    <CTSwitch
      id="course-admin-switch"
      label="Course admin mode" 
      checked={isInstMode}
      onChange={handleCheckboxChange}
    />
  );
}

export default InstModeCheckBox;

