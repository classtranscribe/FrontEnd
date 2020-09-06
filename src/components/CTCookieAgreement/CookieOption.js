import React from 'react';
import { isMobile } from 'react-device-detect';
import { ButtonBase } from '@material-ui/core';
import { CTFragment, CTText } from 'layout';

function CookieOption({
  name,
  desp,
  muted,
  icon,
  ...otherProps
}) {
  const nameSize = isMobile ? 'medium' : 'big';
  const despSize = isMobile ? 'normal' : 'medium';

  return (
    <ButtonBase {...otherProps} role="listitem" className="ct-signin-opt">
      <span className="material-icons">{icon}</span>
      <CTFragment dFlexCol className="opt-text text-left">
        <CTText
          bold 
          muted={muted} 
          size={nameSize} 
          padding={[0,0,5,0]}
          className="opt-name"
        >
          {name}
        </CTText>
        <CTText size={despSize}>{desp}</CTText>
      </CTFragment>
    </ButtonBase>
  );
}

export default CookieOption;
