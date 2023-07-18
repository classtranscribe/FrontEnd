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

  const forwardProps = {
    anchorEl,
    open,
    handleClose,
    styles,
    uniName,
    picture,
    emailId,
    fullName,
    user,
    loginAsUserUni,
    loginAsUserInfo,
    roles
  }

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
          <MuiMenu {...forwardProps} />
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

const MuiMenu = React.forwardRef((props, ref) => {
  return <Menu
    ref={ref}
    anchorEl={props.anchorEl}
    keepMounted
    open={props.open}
    onClose={props.handleClose}
    PaperProps={{ style: props.styles.menu }}
  >
    <ProfileInfo
      uniName={props.uniName}
      picture={props.picture}
      emailId={props.emailId}
      fullName={props.fullName}
      isLoginAsAccount={props.user.isLoginAsAccount}
      loginAsUserUni={props.loginAsUserUni.name}
      loginAsEmailId={props.loginAsUserInfo.emailId}
    />

    <ProfileMenu roles={props.roles} />
         </Menu>
});

UserMenu.propTypes = {
  /** The Nav Header supports dark mode */
  darkMode: PropTypes.bool
};

export default UserMenu;