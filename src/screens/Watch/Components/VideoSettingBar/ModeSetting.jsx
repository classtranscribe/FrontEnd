import React, { useState } from 'react'
import { IconButton, Menu, MenuItem, Typography, ListItemIcon } from '@material-ui/core'
import { Divider } from 'semantic-ui-react'
import { NORMAL_MODE, EQUAL_MODE, PS_MODE, NESTED_MODE } from '../CTPlayerRow/CTPlayerUtil'


const modeOptions = [
  {name: 'One View', icon: 'video_label', mode: NORMAL_MODE},
  {name: 'Equal Width', icon: 'view_module', mode: EQUAL_MODE},
  {name: 'Primary-Secondary', icon: 'dashboard', mode: PS_MODE},
  {name: 'Nested View', icon: 'branding_watermark', mode: NESTED_MODE},
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
    setAnchorEl(null);
  }

  function handleSelect(mode) {
    setMode(mode)
    setTimeout(() => {
      handleClose()
    }, 200)
  }

  const handleSwitch = () => {
    switchScreen()
    setTimeout(() => {
      handleClose()
    }, 200)
  }

  const currOption = modeOptions.filter(opt => opt.mode === mode)[0]
  const open = Boolean(anchorEl)

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
        <i class="material-icons">{currOption.icon}</i>{!isMobile&&<span>&ensp;Screen Modes</span>}
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
            <i class="material-icons">compare_arrows</i>
          </ListItemIcon>
          <Typography variant="inherit">Switch Screens</Typography>
        </MenuItem>
        {
          !isMobile
          &&
          <>
            <MenuDivider text="screen modes" />
            {modeOptions.map(option => (
              <MenuItem key={option.name} 
                selected={option.mode === mode} 
                onClick={() => handleSelect(option.mode)}
              >
                <ListItemIcon style={iconStyle}>
                  <i class="material-icons">{option.icon}</i>
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