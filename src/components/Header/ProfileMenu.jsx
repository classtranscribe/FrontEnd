import React, { useState, useEffect } from 'react'
import { IconButton, Menu, ListItemIcon, Typography, MenuItem } from '@material-ui/core'
import { Icon } from 'semantic-ui-react'
import { util, user, api, handleData } from 'utils'
import { Link } from 'react-router-dom'

const menuStyle = {
  backgroundColor: '#306868', 
  color: 'rgb(236, 236, 236)',
  width: '16em'
}
const iconStyle = { color: 'rgb(236, 236, 236)', fontSize: '1.3rem'}
const fontStyle = {color: '#d5dedf', fontSize: '1.15rem'}

const menuItems = [
  {name: 'Student', title: 'Switch to student page', as: Link, href: util.links.home(), icon: 'fas fa-school'},
  {name: 'Instructor', title: 'Switch to instructor page', as: Link, href: util.links.instructor(), icon: 'fas fa-graduation-cap'},
  {name: 'Admin', title: 'Switch to admin page', as: Link, href: util.links.admin(), icon: 'fas fa-user-cog'}
]

export default function ProfileMenu({ darkMode }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [universities, setUniversities] = useState([])

  useEffect(() => {
    api.getData('Universities').then(({data}) => setUniversities(data))
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
  const { fullName, universityId } = user.getUserInfo()
  const uniName = handleData.findById(universities, universityId).name

  const open = Boolean(anchorEl)
  return (
    <div className="profile-menu">
      <IconButton
        aria-label="Menu button"
        title="Menu"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className="trigger"
      >
        <Icon name='user' circular/>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{style: menuStyle}}
      >
        {isLoggedIn ?
          <>
            <MenuItem disabled>
              <Typography style={fontStyle}>
                Signed in as <strong>{fullName}</strong><br/>
                <span style={{fontSize: '.8em', width: '15em', whiteSpace: 'normal', textAlign: 'center'}}>{uniName}</span>
              </Typography>
            </MenuItem>
            {/* <MenuItem disabled>
              <Typography style={fontStyle}>Signed in as <strong>{fullName}</strong></Typography>
            </MenuItem> */}

            <MenuItem disabled>
              <Typography style={{color: '#d5dedf'}}><strong>SWITCH TO</strong></Typography>
            </MenuItem>
            {menuItems.map( item => (
              <MenuItem 
                title={item.title}
                aria-label={item.title}
                className="menu-item"
                key={item.name} 
                onClick={() => window.location=item.href}
              >
                <ListItemIcon style={iconStyle}>
                  <i class={item.icon}></i>
                </ListItemIcon>
                <Typography style={fontStyle}>{item.name}</Typography>
              </MenuItem>
            ))}
            
            <MenuItem disabled>
              <Typography style={{color: '#d5dedf'}}><strong>HAVE PROBLEMS?</strong></Typography>
            </MenuItem>

            <MenuItem title="Contact us" aria-label="Contact us">
              <ListItemIcon style={iconStyle}>
                <i class="fas fa-envelope"></i>
              </ListItemIcon>
              <Typography style={fontStyle}>Contact Us</Typography>
            </MenuItem>

            <MenuItem title="Sign out" aria-label="Sign out" onClick={() => user.signout()}>
              <ListItemIcon style={iconStyle}>
                <i class="fas fa-sign-out-alt"></i>
              </ListItemIcon>
              <Typography style={fontStyle}>Sign Out</Typography>
            </MenuItem>
          </>
          :
          <MenuItem title="Sign in" aria-label="Sign in" onClick={() => user.login()}>
            <Typography style={fontStyle}>Sign In</Typography>
          </MenuItem>
        }
      </Menu>
    </div>
  )
}