import React, { useState } from 'react'
import $ from 'jquery'
import { IconButton, MenuItem, Menu } from '@material-ui/core'
import { Card } from 'react-bootstrap'
import { util } from 'utils'
const imgHolder = require('images/Video-Placeholder.jpg')

const menuStyle = {
  backgroundColor: '#424242', 
  color: 'rgb(236, 236, 236)',
  width: '100%',
  height: '15rem'
}

export default function UpNext({ media, mediaName, playlistName, medias, courseNumber, isMobile }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const keyDownHandler = ({keyCode}) => {
    let currFocus = $(".upnext-menu .videos .vcard:focus")
    if (!currFocus.length) currFocus = $(".curr-media")  
    if (keyCode == 39) {   
      currFocus.next().focus()
    }
    if (keyCode == 37) {    
      currFocus.prev().focus();
    }
  }

  const scrollToCurrVideo = () => {
    console.log('show upnext')
    if (media.id) {
      const currMedia = document.getElementById(media.id)
      if (currMedia && !currMedia.classList.contains('curr-media')) {
        currMedia.classList.add('curr-media')
        currMedia.scrollIntoView({ inline: "center" })
      }
    }
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
    scrollToCurrVideo()
  }

  function handleClose() {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div id="upnext" onKeyDown={keyDownHandler}>
      <IconButton
        aria-label="Mode Setting"
        title="Mode Setting"
        aria-controls="mode-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className="trigger"
      >
        <i class="material-icons">video_library</i>{!isMobile&&<span>&ensp;Up Next</span>}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        className="upnext-menu"
        PaperProps={{style: menuStyle}}
      >
        <MenuItem className="header" disabled>
          <h4>{courseNumber}</h4>&ensp;{playlistName}
        </MenuItem>

        <div className="videos" id="upnext-videos">
          {medias.map( media2 => (
            <Card 
              className="vcard" 
              key={media2.media.id} 
              id={media2.media.id}
              as="a"
              href={util.links.watch(courseNumber, media2.media.id)}
              title={media2.media.jsonMetadata.title}
              aria-label={media2.media.jsonMetadata.title}
            >
              <Card.Img 
                className="img" variant="top" 
                src={imgHolder} style={{pointerEvents: 'none'}}
              />
              <Card.Body style={{margin: 'none'}}>
                <Card.Title className="title">
                  {media2.media.jsonMetadata.title}
                </Card.Title>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Menu>
    </div>
  )
}
