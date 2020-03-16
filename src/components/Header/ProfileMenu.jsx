import React, { useState, useEffect } from 'react'
import { Menu, ListItemIcon, Typography, MenuItem } from '@material-ui/core'
import { Image } from 'semantic-ui-react'
import { util, user, api, handleData, env } from '../../utils'
import { styles } from './styles'

import MenuTrigger from './MenuTrigger'

const { links } = util

const menuItems = [
  {
    name: 'Student', 
    title: 'Switch to student page', 
    href: links.home(), 
    icon: 'fas fa-school', 
    display: user.isInstructor() || user.isAdmin()
  },{
    name: 'Instructor', 
    title: 'Switch to instructor page', 
    href: links.instructor(), 
    icon: 'fas fa-graduation-cap', 
    display: user.isInstructor()
  },{
    name: 'Admin', 
    title: 'Switch to admin page', 
    href: links.admin(), 
    icon: 'fas fa-user-cog', 
    display: user.isAdmin()
  }
]

export default function ProfileMenu({ 
  darkMode 
}) {

  const [anchorEl, setAnchorEl] = useState(null)
  const [universities, setUniversities] = useState([])

  useEffect(() => {
    api.getUniversities().then( ({data}) => setUniversities(data) )
  }, [darkMode])

  const handleClick = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setTimeout(() => setAnchorEl(null), 200)
  }

  const isLoggedIn = user.isLoggedIn()
  const { fullName, universityId, picture, roles } = user.getUserInfo()
  const uniName = handleData.findById(universities, universityId).name

  const open = Boolean(anchorEl)

  return (
    <div className="profile-menu">
      <MenuTrigger picture={picture} handleClick={handleClick} />
      {
        isLoggedIn
        ?
        /** Signed in menu */
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{style: styles.menu}}
        >
          <MenuItem disabled id="profile">
            <div className="profile">
              {
                picture 
                && 
                <Image circular
                  src={picture}  
                  alt={`profile picture for ${fullName}`} 
                />
              }
              <Typography style={styles.font}>
                Signed in as <strong>{fullName}</strong><br/>
                <span>{uniName}</span>
                {
                  user.isLoginAsAccount()
                  &&
                  <>
                    <br/><br/>
                    <span>You are accessing content of <strong>{user.getLoginAsUserInfo().emailId}</strong></span>
                    <br/>
                  </>
                }
              </Typography>
            </div>
          </MenuItem>

          {/* Switch to diff roles (signed in menu) */}

          {
            roles
            &&
            <MenuItem disabled>
              <Typography style={styles.title}>
                <strong>SWITCH TO</strong>
              </Typography>
            </MenuItem>
          }

          {menuItems.map( item => 
            item.display ? (
              <MenuItem 
                title={item.title}
                aria-label={item.title}
                className="menu-item"
                key={item.name} 
                onClick={() => window.location=item.href}
              >
                <ListItemIcon style={styles.icon}>
                  <i className={item.icon}></i>
                </ListItemIcon>
                <Typography style={styles.font}>{item.name}</Typography>
              </MenuItem>
            ) : null 
          )}

          
          {/* General Options */}

          <MenuItem disabled>
            <Typography style={styles.title}>
              <strong>HAVE PROBLEMS?</strong>
            </Typography>
          </MenuItem>

          <MenuItem 
            title="Contact us" 
            aria-label="Contact us" 
            onClick={() => window.location = 'mailto:classtranscribe@illinois.edu'}
          >
            <ListItemIcon style={styles.icon}>
              <i className="fas fa-envelope"></i>
            </ListItemIcon>
            <Typography style={styles.font}>Contact Us</Typography>
          </MenuItem>

          <MenuItem title="Sign out" aria-label="Sign out" onClick={() => user.signout()}>
            <ListItemIcon style={styles.icon}>
              <i className="fas fa-sign-out-alt"></i>
            </ListItemIcon>
            <Typography style={styles.font}>Sign Out</Typography>
          </MenuItem>
        </Menu>


      : 
      /** Unsigned in menu */
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{style: styles.menu}}
        >
          <MenuItem aria-label="Sign In" onClick={user.signin}>
            <Typography style={styles.font}>Sign In</Typography>
          </MenuItem>
          {
            env.dev
            &&
            <MenuItem aria-label="Test Sign In" onClick={user.testAccountSignIn}>
              <Typography style={styles.font}>Test Sign In</Typography>
            </MenuItem>
          }
        </Menu>
      }
    </div>
  )
}