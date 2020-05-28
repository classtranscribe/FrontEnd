import React from 'react';
import PropTypes from 'prop-types';
import { Menu, ListItemIcon, Typography, MenuItem } from '@material-ui/core';

import { user, env } from 'utils';
import { styles } from './styles';

export function SignInMenu(props) {
  let { open, anchorEl, handleClose } = props;

  const auth0SignIn = () => user.signIn({ method: user.method.AUTH0 });
  const ciLogonSignIn = () => user.signIn({ method: user.method.CILOGON });
  const testSignIn = () => user.signIn({ method: user.method.TEST });

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={open}
      onClose={handleClose}
      PaperProps={{ style: styles.menu }}
    >
      <MenuItem aria-label="Sign //" onClick={ciLogonSignIn}>
        <ListItemIcon style={styles.icon}>
          <i className="fas fa-university" />
        </ListItemIcon>
        <Typography style={styles.font}>University Credential Sign In</Typography>
      </MenuItem>
      <MenuItem aria-label="Sign in using email" onClick={auth0SignIn}>
        <ListItemIcon style={styles.icon}>
          <i className="fas fa-envelope" />
        </ListItemIcon>
        <Typography style={styles.font}>(Old) Email Sign In</Typography>
      </MenuItem>
      {env.dev && (
        <MenuItem aria-label="Test Sign In" onClick={testSignIn}>
          <ListItemIcon style={styles.icon}>
            <i className="fas fa-laptop-code" />
          </ListItemIcon>
          <Typography style={styles.font}>Test Sign In</Typography>
        </MenuItem>
      )}
    </Menu>
  );
}

SignInMenu.propTypes = {
  /** Show the sign-in menu */
  open: PropTypes.bool,

  /** Menu Element */
  anchorEl: PropTypes.element,

  /** Handle menu close */
  handleClose: PropTypes.func
};
