import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'pico-ui';
import { util, user } from 'utils';
import './index.scss';

import { ClassTranscribeHeader, SignInMenu } from 'components';

const defaultError = {
  code: '404',
  header: 'The page cannot be found',
  description:
    'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
};

export function CTErrorWrapper({
  dark = false,
  show = false,
  navbar = false,
  retry = true,
  signInButton = true,
  goHomeButton = false,
  error = defaultError,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setTimeout(() => setAnchorEl(null), 200);
  };

  error = { ...defaultError, ...error };
  const { code, header, description } = error;
  const darkclass = dark ? ' dark' : '';

  return show ? (
    <div className={`ct-error-wrapper${darkclass}`}>
      {navbar && <ClassTranscribeHeader />}
      <div className="ct-ew-body">
        <div className="ct-ew-info">
          <div className="ct-ew-code">{code}</div>
          <h1 className="ct-ew-header">{header}</h1>
          <div className="ct-ew-descrip">{description}</div>
        </div>

        <div className="ct-ew-actions">
          {signInButton && user.isLoggedIn && (
            <>
              <Button color="teal" onClick={handleClick}>
                Sign in to continue
              </Button>
              <SignInMenu open={Boolean(anchorEl)} anchorEl={anchorEl} handleClose={handleClose} />
            </>
          )}
          {goHomeButton && <Link to={util.links.home()}>GO HOME</Link>}
          {retry && <a href={util.links.currentUrl()}>REFRESH THE PAGE</a>}
        </div>
      </div>
    </div>
  ) : null;
}
