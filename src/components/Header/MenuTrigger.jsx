import React from 'react';
import { Button } from 'pico-ui';
import { Image } from 'semantic-ui-react';


function MenuTrigger({
  picture,
  isLoggedIn,
  usernameInitial,
  handleClick
}) {
  return !isLoggedIn ? (
    <Button uppercase
      color="teal"
      text="Sign in"
      onClick={handleClick}
    />
  ) : picture ? (
    <Image circular
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
      <div>{usernameInitial}</div>
    </div>
  );
}

export default MenuTrigger;