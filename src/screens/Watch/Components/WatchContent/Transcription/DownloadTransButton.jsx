import React, { useState } from 'react'
import { Menu, MenuItem, Typography, ListItemIcon } from '@material-ui/core'
import { Button, Popup, Divider } from 'semantic-ui-react'
// vars
import { captionLangMap } from './../ClassTranscribePlayer/CTPlayerUtils'
import { api } from 'utils'
var fileDownload = require('js-file-download')

const menuStyle = {
  backgroundColor: '#424242', 
  color: 'rgb(236, 236, 236)',
  width: '200px',
}
const iconStyle = { color: 'rgb(236, 236, 236)' }

export default function DownloadTransButton({ trans=[] }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onDownload = (path, language) => {
    api.getFile(path).then( ({data}) => {
      fileDownload(data, `transcription-${language}.vtt`)
      handleClose()
    })
  }

  return (
    <div className="download-trans-btn">
      <Popup inverted
        content="Download"
        trigger={
          <Button 
            compact
            onClick={handleClick} 
            aria-label="Download" 
            icon={<i className="material-icons">cloud_download</i>}
          />
        }
      />
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className="playlist-menu"
        PaperProps={{style: menuStyle}}
      >
        <MenuItem disabled>
          <div className="w-100">
            <MenuDivider text="Transcriptions" />
          </div>
        </MenuItem>
        {trans.map( trans => (
          <MenuItem onClick={() => onDownload(trans.src, trans.language)} key={trans.id}>
            <ListItemIcon style={iconStyle}>
              <i className="material-icons">subtitles</i>
            </ListItemIcon>
            <Typography variant="inherit">{captionLangMap[trans.language]}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

function MenuDivider({ text }) {
  return (
    <Divider inverted style={{width: ''}} horizontal>{text}</Divider>
  )
}