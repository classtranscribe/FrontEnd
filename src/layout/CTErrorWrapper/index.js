import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Button } from 'pico-ui';
import { user, links } from 'utils';
import './index.scss';

import { CTNavHeader } from '../CTNavHeader';
import { SignInMenu } from '../CTNavHeader/NavHeaderMenu/SignInMenu';

/**
 * A general error wrapper
 */
export function CTErrorWrapper(props) {
  let {
    show = false,
    darkMode = false,
    navbar = false,
    retry = true,
    signInButton = true,
    goHomeButton = false,
    code = '404',
    header = 'The page cannot be found',
    description = 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setTimeout(() => setAnchorEl(null), 200);
  };

  const wrapperClasses = classNames('ct-error-wrapper', { dark: darkMode });

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
            (signInButton && user.isLoggedIn) 
            &&
            <>
              <Button color="teal" onClick={handleClick}>
                Sign in to continue
              </Button>
              <SignInMenu open={Boolean(anchorEl)} anchorEl={anchorEl} handleClose={handleClose} />
            </>
          }

          {
            goHomeButton 
            && 
            <Link to={links.home()}>GO HOME</Link>
          }

          {
            retry 
            && 
            <a href={links.currentUrl()}>REFRESH THE PAGE</a>
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

  /** Show the go-home button */
  goHomeButton: PropTypes.bool,

  /** The error code, default as '404' */
  code: PropTypes.any,

  /** The error header/name */
  header: PropTypes.any,

  /** The error description */
  description: PropTypes.any
};