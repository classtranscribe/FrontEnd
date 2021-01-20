import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import { SignInButton } from 'layout';
import { user } from 'utils';
import './index.scss';

export function SignInPrompt(props) {
  const {
    buttonText = 'Sign In',
    topDescription = <>Can&#39;t find your courses? <br />Sign in to see more.</>,
    bottomDescription = '',
    darkMode = false,
    targetBlank,
    closeAfterSignedIn,
  } = props;

  const [isSigningIn, setIsSigningIn] = useState(false);

  const promptClasses = classNames('ct-signin-prompt', { dark: darkMode });

  const handleSigningIn = () => {
    setIsSigningIn(true);
  };

  return user.isLoggedIn ? null : (
    <div className={promptClasses}>
      <div className="ct-signin-card">
        {
          topDescription
          &&
          <div className="ct-signin-descrip">
            {
              isSigningIn
              ?
              "Manually refresh the player if you have successfully signed in."
              :
              topDescription
            }
          </div>
        }

        {
          isSigningIn ? (
            <Button 
              onClick={() => window.location.reload()}
              variant="outlined"
              startIcon={<span className="material-icons">refresh</span>}
            >
              Manually refresh here
            </Button>
          ) : (
            <SignInButton 
              targetBlank={targetBlank}
              closeAfterSignedIn={closeAfterSignedIn}
              onAfterClick={handleSigningIn}
            >
              {buttonText}
            </SignInButton>
          )
        }

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
  darkMode: PropTypes.bool,

  /** True if open the sign-in page in a new window by setting `target="_blank"` */
  targetBlank: PropTypes.bool,

  /** True if you want to closed the window after signin processed finished */
  closeAfterSignedIn: PropTypes.bool
};