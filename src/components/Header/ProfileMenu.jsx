import React, { useState, useEffect } from 'react'
import { IconButton, Menu, ListItemIcon, Typography, MenuItem } from '@material-ui/core'
import { Icon, Image } from 'semantic-ui-react'
import { util, user, api, handleData } from '../../utils'
import { Link } from 'react-router-dom'

const menuStyle = {
  backgroundColor: '#306868', 
  color: 'rgb(236, 236, 236)',
  width: '280px'
}
const iconStyle = { color: 'rgb(236, 236, 236)', fontSize: '1.3rem'}
const fontStyle = {color: '#d5dedf', fontSize: '1.15rem'}

const menuItems = [
  {name: 'Student', title: 'Switch to student page', as: Link, href: util.links.home(), icon: 'fas fa-school', display: user.isInstructor() || user.isAdmin()},
  {name: 'Instructor', title: 'Switch to instructor page', as: Link, href: util.links.instructor(), icon: 'fas fa-graduation-cap', display: user.isInstructor()},
  {name: 'Admin', title: 'Switch to admin page', as: Link, href: util.links.admin(), icon: 'fas fa-user-cog', display: user.isAdmin()}
]

export default function ProfileMenu({ darkMode }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [universities, setUniversities] = useState([])

  useEffect(() => {
    api.getUniversities().then(({data}) => setUniversities(data))
  }, [darkMode])

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setTimeout(() => {
      setAnchorEl(null)
    }, 200)
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
        &&
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{style: menuStyle}}
        >
          <MenuItem disabled id="profile">
            <div className="profile">
              {picture && <Image src={picture} circular alt={`profile picture for ${fullName}`} />}
              <Typography style={fontStyle}>
                Signed in as <strong>{fullName}</strong><br/>
                <span>{uniName}</span>
                {
                  user.isTestAccount()
                  &&
                  <>
                    <br/><br/>
                    <span>You are accessing content of <strong>{user.getTestUserInfo().emailId}</strong></span>
                    <br/>
                  </>
                }
              </Typography>
            </div>
          </MenuItem>

          {
            roles
            &&
            <MenuItem disabled>
              <Typography style={{color: '#d5dedf'}}><strong>SWITCH TO</strong></Typography>
            </MenuItem>
          }

          {menuItems.map( item => item.display ? (
            <MenuItem 
              title={item.title}
              aria-label={item.title}
              className="menu-item"
              key={item.name} 
              onClick={() => window.location=item.href}
            >
              <ListItemIcon style={iconStyle}>
                <i className={item.icon}></i>
              </ListItemIcon>
              <Typography style={fontStyle}>{item.name}</Typography>
            </MenuItem>
          ) : null )}
          
          <MenuItem disabled>
            <Typography style={{color: '#d5dedf'}}><strong>HAVE PROBLEMS?</strong></Typography>
          </MenuItem>

          <MenuItem 
            title="Contact us" 
            aria-label="Contact us" 
            onClick={() => window.location = 'mailto:classtranscribe@illinois.edu'}
          >
            <ListItemIcon style={iconStyle}>
              <i className="fas fa-envelope"></i>
            </ListItemIcon>
            <Typography style={fontStyle}>Contact Us</Typography>
          </MenuItem>

          <MenuItem title="Sign out" aria-label="Sign out" onClick={() => user.signout()}>
            <ListItemIcon style={iconStyle}>
              <i className="fas fa-sign-out-alt"></i>
            </ListItemIcon>
            <Typography style={fontStyle}>Sign Out</Typography>
          </MenuItem>
        </Menu>
      }
      {
        !isLoggedIn
        &&
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{style: menuStyle}}
        >
          <MenuItem title="Sign in" aria-label="Sign in" onClick={() => user.login()}>
            <Typography style={fontStyle}>Sign In</Typography>
          </MenuItem>
        </Menu>
      }
    </div>
  )
}

function MenuTrigger({ picture, handleClick }) {
  return picture ? (
    <Image 
      tabIndex={0} onClick={handleClick} 
      src={picture}  circular size="mini" 
      className="profile-img"
      alt="profile picture"
      aria-haspopup="true"
      aria-label="Menu trigger"
      title="Menu"
    />
  ) : (
    <IconButton
      aria-label="Menu trigger"
      title="Menu"
      aria-controls="profile-menu"
      aria-haspopup="true"
      onClick={handleClick}
      className="trigger"
    >
      <Icon name='user' circular/>
    </IconButton>
  )
}