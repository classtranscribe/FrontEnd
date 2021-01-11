import React from 'react';
import { CTCheckbox } from 'layout';

function InstModeCheckBox({
  isInstMode, onChange
}) {
  return (
    <CTCheckbox 
      label="Course admin mode" 
      checked={isInstMode}
      onChange={onChange}
    />
  );
}

export default InstModeCheckBox;

