import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'pico-ui';
import { Image } from 'semantic-ui-react';


function MenuTrigger(props) {
  let {
    picture,
    isLoggedIn,
    email = '',
    handleClick
  } = props;

  return !isLoggedIn ? (
    <Button
      uppercase
      color="teal"
      text="Sign in"
      onClick={handleClick}
    />
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