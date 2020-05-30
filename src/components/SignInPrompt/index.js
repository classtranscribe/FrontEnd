import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

import { Button } from 'pico-ui';
import { SignInMenu } from 'layout/CTNavHeader/NavHeaderMenu/SignInMenu';

export function SignInPrompt(props) {
  let {
    buttonColor = 'teal',
    buttonText = 'Sign In',
    topDescription = '',
    bottomDescription = '',
    darkMode = false
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setTimeout(() => setAnchorEl(null), 200);
  };

  const handleOpen = e => setAnchorEl(e.target);

  const promptClasses = classNames('ct-signin-prompt', { dark: darkMode });

  return (
    <div className={promptClasses}>
      <div className="ct-signin-card">
        {
          topDescription
          &&
          <div className="ct-signin-descrip">{topDescription}</div>
        }

        <Button
          compact
          uppercase
          color={buttonColor}
          text={buttonText}
          onClick={handleOpen}
        />
        
        <SignInMenu
          open={Boolean(anchorEl)}
          darkMode={darkMode}
          anchorEl={anchorEl} 
          handleClose={handleClose}
        />

        {
          bottomDescription
          &&
          <div className="ct-signin-descrip">{bottomDescription}</div>
        }
      </div>
    </div>
  );
}

SignInPrompt.propTypes = {
  /** 
   * Choose sign-in trigger's color, default as `teal`  
   * Pick one from `teal`, `black`, `primary`, `transparent teal`
   */
  buttonColor: PropTypes.oneOf(['teal', 'black', 'primary', 'transparent teal']),

  /** Text of the sign-in trigger, default as `Sign In` */
  buttonText: PropTypes.string,

  /** Description above the sign-in trigger */
  topDescription: PropTypes.node,

  /** Description below the sign-in trigger */
  bottomDescription: PropTypes.node,

  /** SignInPrompt supports darkMode */
  darkMode: PropTypes.bool
};