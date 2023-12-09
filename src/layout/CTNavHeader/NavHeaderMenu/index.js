/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Menu } from '@material-ui/core';

import _ from 'lodash';
import { user, api } from 'utils';
import { styles } from './styles';

import MenuTrigger from './MenuTrigger';
import ProfileInfo from './ProfileInfo';
import ProfileMenu from './ProfileMenu';

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
  /* This generates two errors  in the browser console that appear to be harmless.
  This code also used to use  e.currentTarget, and useRef was also investigated.
  Ultimately we just positioned it top right . */
  /* Warning: Failed prop type: Material-UI: The `anchorEl` prop provided to the component is invalid.
     It should be an Element instance but it's `undefined` instead. */
  /* Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
     Check the render method of `ForwardRef(Menu)`.
      in ProfileInfo (at NavHeaderMenu/index.js:74)
      in ul (created by ForwardRef(List)) */


  return (
    <div className="profile-menu">
      <MenuTrigger
        picture={picture}
        isLoggedIn={user.isLoggedIn}
        email={emailId}
        handleClick={handleClick}
        onKeyUp={handleClick} 
      />

      {
        user.isLoggedIn ?
        /** Signed in menu */
          <Menu
            anchorOrigin={{
              vertical:'top',
              horizontal: 'right'
            }}
            keepMounted={false}
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
         null
      }
    </div>
  );
}

UserMenu.propTypes = {
  /** The Nav Header supports dark mode */
  darkMode: PropTypes.bool
};

export default UserMenu;
