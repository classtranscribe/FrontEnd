/**
 * Setting menu for screen mode
 */

import React, { useState } from 'react'
import { IconButton, Menu, MenuItem, Typography, ListItemIcon } from '@material-ui/core'
import { Divider } from 'semantic-ui-react'
import { NORMAL_MODE, EQUAL_MODE, PS_MODE, NESTED_MODE } from '../constants'


const modeOptions = [
  {name: 'One View', icon: 'video_label', mode: NORMAL_MODE},
  {name: 'Equal Width', icon: 'view_week', mode: EQUAL_MODE},
  {name: 'Primary-Secondary', icon: 'view_carousel', mode: PS_MODE},
  {name: 'Nested View', icon: 'featured_video', mode: NESTED_MODE},
]

const menuStyle = {
  backgroundColor: '#424242', 
  color: 'rgb(236, 236, 236)',
  width: '17rem'
}
const iconStyle = { color: 'rgb(236, 236, 236)' }

export default function ModeSetting({show, mode, setMode, switchScreen, isMobile}) {
  const [anchorEl, setAnchorEl] = useState(null)
  if (!show) return null

  function handleClick(event) {
    if (!anchorEl) setAnchorEl(event.currentTarget)
    else handleClose()
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleSelect(mode) {
    setMode(mode)
    handleClose()
  }

  const handleSwitch = () => {
    switchScreen()
    handleClose()
  }

  const currOption = modeOptions.filter(opt => opt.mode === mode)[0]
  const open = Boolean(anchorEl)
  // if it is mobile size there will not be two players in parallel
  const shouldDisable = mode => isMobile && mode !== NESTED_MODE && mode !== NORMAL_MODE

  return (
    <div>
      <IconButton
        aria-label="Mode Setting"
        title="Mode Setting"
        aria-controls="mode-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className="trigger"
      >
        <i className="material-icons">{currOption.icon}</i>{!isMobile&&<span>&ensp;Screen Modes</span>}
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        className="mode-menu"
        PaperProps={{style: menuStyle}}
      >
        <MenuItem key="switch" onClick={handleSwitch}>
          <ListItemIcon style={iconStyle}>
            <i className="material-icons">compare_arrows</i>
          </ListItemIcon>
          <Typography variant="inherit">Switch Screens</Typography>
        </MenuItem>
        {
          switchScreen // can switch screen mode if there is 2 videos
          &&
          <>
            <MenuDivider text="screen modes" />
            {modeOptions.map(option => shouldDisable(option.mode) ? null : (
              <MenuItem key={option.name} 
                selected={option.mode === mode} 
                onClick={() => handleSelect(option.mode)}
              >
                <ListItemIcon style={iconStyle}>
                  <i className="material-icons">{option.icon}</i>
                </ListItemIcon>
                <Typography variant="inherit">{option.name}</Typography>
              </MenuItem>
            ))}
          </>
        }
      </Menu>
    </div>
  )
}

function MenuDivider({ text }) {
  return (
    <Divider inverted style={{width: ''}} horizontal>{text}</Divider>
  )
}