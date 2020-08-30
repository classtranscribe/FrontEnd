import React from 'react';
import { ButtonBase } from '@material-ui/core';
import { CTFragment, CTText } from 'layout';

function CookieOption({
  name,
  desp,
  muted,
  icon,
  ...otherProps
}) {
  return (
    <ButtonBase {...otherProps} role="listitem" className="ct-signin-opt">
      <span className="material-icons">{icon}</span>
      <CTFragment list className="opt-text text-left">
        <CTText bold muted={muted} size="big" padding={[0,0,5,0]} className="opt-name">
          {name}
        </CTText>
        <CTText size="medium">{desp}</CTText>
      </CTFragment>
    </ButtonBase>
  );
}

export default CookieOption;
