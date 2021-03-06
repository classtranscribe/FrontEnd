import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'dva/router';
import Button from '@material-ui/core/Button';
import { user, links } from 'utils';
import CTNavHeader, { useSignButtonProps } from '../CTNavHeader';
import { useButtonStyles } from '../CTButtons';
import './index.scss';

/**
 * A general error wrapper
 */
function CTErrorWrapper(props) {
  const {
    fixed = true,
    show = false,
    darkMode = false,
    navbar = false,
    retry = true,
    signInButton = true,
    goHomeButton = false,
    redirectUri = window.location.href,
    code = '404',
    header = 'The page cannot be found',
    description = 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
  } = props;

  const signinProps = useSignButtonProps(redirectUri);
  const bthStyles = useButtonStyles();
  const wrapperClasses = classNames('ct-error-wrapper', { dark: darkMode, fixed });

  return show ? (
    <div className={wrapperClasses}>
      {navbar && <CTNavHeader fixed />}
      <div className="ct-ew-body">
        <div className="ct-ew-info">
          <div className="ct-ew-code">{code}</div>
          <h1 className="ct-ew-header">{header}</h1>
          <div className="ct-ew-descrip">{description}</div>
        </div>

        <div className="ct-ew-actions">
          {
            (signInButton && !user.isLoggedIn) 
            &&
            <Button {...signinProps}>Sign In to Continue</Button>
          }

          {
            goHomeButton 
            && 
            <Button component={Link} className={bthStyles.tealLink} to={links.home()}>
              GO HOME
            </Button>
          }

          {
            retry 
            && 
            <Button component="a" className={bthStyles.tealLink} to={links.currentUrl()}>
              REFRESH THE PAGE
            </Button>
          }
        </div>
      </div>
    </div>
  ) : null;
}

CTErrorWrapper.propTypes = {
  /** The CTErrorWrapper supports darkMode */
  darkMode: PropTypes.bool,

  /** True if show the CTErrorWrapper */
  show: PropTypes.bool,

  /** The CTErrorWrapper can display as a page */
  pageLike: PropTypes.bool,

  /** Show the retry link/button */
  retry: PropTypes.bool,

  /** Show the sign-in button */
  signInButton: PropTypes.bool,

  /** redirect uri for signin callback */
  redirectUri: PropTypes.string,

  /** Show the go-home button */
  goHomeButton: PropTypes.bool,

  /** The error code, default as '404' */
  code: PropTypes.any,

  /** The error header/name */
  header: PropTypes.any,

  /** The error description */
  description: PropTypes.any
};

export default CTErrorWrapper;