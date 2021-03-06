import React from 'react';
import { CTSwitch } from 'layout';

function InstModeCheckBox({
  isInstMode, onChange
}) {
  return (
    <CTSwitch
      id="course-admin-switch"
      label="Course admin mode" 
      checked={isInstMode}
      onChange={onChange}
    />
  );
}

export default InstModeCheckBox;

