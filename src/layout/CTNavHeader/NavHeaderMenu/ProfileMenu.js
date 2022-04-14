import React, { useState } from 'react';
import PropTypes, { func } from 'prop-types';
import { ListItemIcon, Typography, MenuItem } from '@material-ui/core';

import { user, links } from 'utils';
import { styles } from './styles';

const menuItems = [
  {
    name: `Student ${user.isLoginAsAccount ? `(${user.getLoginAsUserInfo().emailId})` : ''}`,
    title: 'Switch to student page',
    href: links.home(),
    icon: 'fas fa-school',
    display: user.isInstructor || user.isAdmin,
  },
  {
    name: `Instructor ${user.isLoginAsAccount ? `(${user.getLoginAsUserInfo().emailId})` : ''}`,
    title: 'Switch to instructor page',
    href: links.instructor(),
    icon: 'fas fa-graduation-cap',
    display: user.isInstructor,
  },
  {
    name: `Admin ${user.isLoginAsAccount ? '(You)' : ''}`,
    title: 'Switch to admin page',
    href: links.admin(),
    icon: 'fas fa-user-cog',
    display: user.isAdmin,
  },
];

function ProfileMenu({ props }) {
  let roles = props;
  const onContactUs = () => {
    window.location = links.contactUs();
  };
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme == 'dark') {
    var els = document.getElementsByTagName('*');
    for (var i = 0, all = els.length; i < all; i++) {
      els[i].classList.add('dark');
    }
  }
  const onDarkMode = () => {
    console.log(localStorage.getItem("theme"));
    var els = document.getElementsByTagName('*');
    for (var i = 0, all = els.length; i < all; i++) {
      els[i].classList.toggle('dark');
    }
    console.log(document);
    if (localStorage.getItem("theme") == 'dark') {
      document.getElementById('dark-mode').className = 'fas fa-moon';
    } else {
      document.getElementById('dark-mode').className = 'fas fa-sun';
    }
    let theme = 'dark';
    if (localStorage.getItem("theme") == 'dark') {
      theme = 'light';
    }
    localStorage.setItem('theme', theme);
  };

  return (
    <>
      {roles && (
        <MenuItem disabled>
          <Typography style={styles.title}>
            <strong>SWITCH TO</strong>
          </Typography>
        </MenuItem>
      )}

      {menuItems.map((item) =>
        item.display ? (
          <MenuItem
            title={item.title}
            aria-label={item.title}
            className="menu-item"
            key={item.name}
            onClick={() => {
              window.location = item.href;
            }}
          >
            <ListItemIcon style={styles.icon}>
              <i className={item.icon} />
            </ListItemIcon>
            <Typography style={styles.font}>{item.name}</Typography>
          </MenuItem>
        ) : null,
      )}

      {/* General Options */}

      <MenuItem disabled>
        <Typography style={styles.title}>
          <strong>HAVE PROBLEMS?</strong>
        </Typography>
      </MenuItem>

      <MenuItem title="Contact us" aria-label="Contact us" onClick={onContactUs}>
        <ListItemIcon style={styles.icon}>
          <i className="fas fa-envelope" />
        </ListItemIcon>
        <Typography style={styles.font}>Contact Us</Typography>
      </MenuItem>
      <MenuItem title="Dark Mode (Beta)" aria-label="Dark Mode (Beta)" onClick={onDarkMode}>
        <ListItemIcon style={styles.icon}>
          <i id="dark-mode" className="fas fa-moon" />
        </ListItemIcon>
        <Typography id="dark-mode-item" style={styles.font}>
          {localStorage.getItem("theme") == "dark" ? 'Light Mode' : 'Dark Mode (Beta)'}
        </Typography>
      </MenuItem>

      <MenuItem title="Sign out" aria-label="Sign out" onClick={() => user.signOut()}>
        <ListItemIcon style={styles.icon}>
          <i className="fas fa-sign-out-alt" />
        </ListItemIcon>
        <Typography style={styles.font}>Sign Out</Typography>
      </MenuItem>
    </>
  );
}

ProfileMenu.propTypes = {
  /** Roles of the user */
  roles: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
};

export default ProfileMenu;
