import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import Button from '@material-ui/core/Button';
import { useButtonStyles } from 'layout';
import { links } from 'utils';
import { Image } from 'semantic-ui-react';


function MenuTrigger(props) {
  let {
    picture,
    isLoggedIn,
    email = '',
    handleClick
  } = props;

  const btn = useButtonStyles();

  return !isLoggedIn ? (
    <Button 
      component={Link} 
      variant="contained" 
      to={links.signIn()} 
      className={btn.teal}
    >
      SIGN IN
    </Button>
  ) : picture ? (
    <Image
      circular
      role="button"
      size="mini"
      tabIndex={0}
      src={picture}
      alt="profile picture"
      title="Profile Menu"
      aria-label="Profile Menu"
      aria-haspopup="true"
      aria-controls="profile-menu"
      className="profile-img"
      onClick={handleClick}
    />
  ) : (
    <div 
      role="button"
      tabIndex={0}
      title="Profile Menu"
      aria-label="Profile Menu"
      aria-haspopup="true"
      aria-controls="profile-menu"
      className="profile-img-alt"
      onClick={handleClick}
    >
      <div>{email.slice(0, 1)}</div>
    </div>
  );
}

MenuTrigger.propTypes = {
  /** User profile image */
  picture: PropTypes.string,

  /** True if the user is logged in */
  isLoggedIn: PropTypes.bool,

  /** Initial letter of the user's name */
  email: PropTypes.string,

  /** Handle menu trigger click */
  handleClick: PropTypes.func
};

export default MenuTrigger;