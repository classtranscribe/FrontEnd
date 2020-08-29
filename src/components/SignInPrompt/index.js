import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SignInButton } from 'layout';
import { user } from 'utils';
import './index.scss';

export function SignInPrompt(props) {
  let {
    buttonText = 'Sign In',
    topDescription = <>Can&#39;t find your courses? <br />Sign in to see more.</>,
    bottomDescription = '',
    darkMode = false
  } = props;

  const promptClasses = classNames('ct-signin-prompt', { dark: darkMode });

  return user.isLoggedIn ? null : (
    <div className={promptClasses}>
      <div className="ct-signin-card">
        {
          topDescription
          &&
          <div className="ct-signin-descrip">{topDescription}</div>
        }

        <SignInButton>{buttonText}</SignInButton>

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