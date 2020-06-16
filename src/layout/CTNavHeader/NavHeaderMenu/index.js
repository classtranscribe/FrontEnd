import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Menu } from '@material-ui/core';

import _ from 'lodash';
import { user, api } from 'utils';
import { styles } from './styles';

import MenuTrigger from './MenuTrigger';
import ProfileInfo from './ProfileInfo';
import ProfileMenu from './ProfileMenu';
import { SignInMenu } from './SignInMenu';

function UserMenu(props) {
  let { darkMode = false } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    api.getUniversities()
      .then(({ data }) => setUniversities(data));
  }, [darkMode]);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setTimeout(() => setAnchorEl(null), 200);
  };

  const { 
    fullName, 
    universityId, 
    picture, 
    emailId, 
    roles 
  } = user.getUserInfo({
    allowLoginAsOverride: false,
  });

  let uni = _.find(universities, { id: universityId });
  let uniName = uni ? uni.name : '';

  const loginAsUserInfo = user.getLoginAsUserInfo();
  let loginAsUserUni = _.find(universities, { id: loginAsUserInfo.universityId }) || { name: '' };

  const open = Boolean(anchorEl);

  return (
    <div className="profile-menu">
      <MenuTrigger
        picture={picture}
        isLoggedIn={user.isLoggedIn}
        email={emailId}
        handleClick={handleClick}
      />

      {
        user.isLoggedIn ?
        /** Signed in menu */
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            PaperProps={{ style: styles.menu }}
          >
            <ProfileInfo
              uniName={uniName}
              picture={picture}
              emailId={emailId}
              fullName={fullName}
              isLoginAsAccount={user.isLoginAsAccount}
              loginAsUserUni={loginAsUserUni.name}
              loginAsEmailId={loginAsUserInfo.emailId}
            />

            <ProfileMenu roles={roles} />
          </Menu>
        :
          <SignInMenu 
            open={open} 
            anchorEl={anchorEl} 
            handleClose={handleClose}
          />
      }
    </div>
  );
}

UserMenu.propTypes = {
  /** The Nav Header supports dark mode */
  darkMode: PropTypes.bool
};

export default UserMenu;
