/**
 * The component for Instructor Offering Page
 * contains the video list and editing buttons
 */

import React from 'react'
import { Tab } from 'react-bootstrap'
import { List, Image, Dropdown, Button, Icon } from 'semantic-ui-react'
import { FixedFooter } from '../../../../components'
import { util } from '../../../../util'
const profileImg = require('../../../../images/Video-Placeholder.jpg')

const getColor = type => {
  return type === 'YouTube' ? 'red' : null
}

const getIcon = type => {
  return type === 'YouTube' ? 'youtube' : 
         type === 'Echo360' ? 'video play' : 'file video'
}

export function VideoList({playlists}) {

  return (
    <Tab.Content className="csp-videos">
      {playlists.map( playlist => (
          <Tab.Pane eventKey={playlist.name} aria-label="Video List" key={playlist.name}>  
            <PlaylistInfoHeader playlist={playlist} />          
            {playlist.videos.length ? 
              <List verticalAlign='middle' className="vlist" role="list">
                {playlist.videos.map( (video, index) => (
                  <List.Item className="video-card" key={video+index}> {/* should be video.id */}
                    <EditVideoButtons show={playlist.type !== 'YouTube'} video={video}/>

                    {/* The video Info */}
                    <Image 
                      alt="Video Poster"
                      className="img" 
                      onClick={()=>util.watch()} // to video page
                      src={profileImg}
                      aria-label={`see video ${video}`}
                      title={`see video ${video}`}
                    />
                    <List.Content>
                      <div className="info">
                        <p 
                          className={`title ${playlist.type.toLowerCase()}`} 
                          onClick={()=>util.watch()} // to video page
                          aria-label={`see video ${video}`}
                          title={`see video ${video}`}
                        >
                          {video} 
                        </p>
                        <p className="text-muted">0:5:35</p>
                      </div>
                    </List.Content>
                  </List.Item>
                ))}
                </List> : <NoVideoWrapper />
            }
          </Tab.Pane>
        ))}
        <FixedFooter />
    </Tab.Content>
  )
}

function PlaylistInfoHeader({playlist: {name, type}}) {
  return (
    <div className="pl-info-header d-inline">
      <h1 className={`name ${type.toLowerCase()}`}>
        <Icon size='big' color={getColor(type)} name={getIcon(type)}/>
        &ensp;{name}
      </h1> 
      <EditPlaylistBtns type={type}/>
    </div>
  )
}

/**
 *  Buttons for editing current playlist 
 */
function EditPlaylistBtns({type}) {
  const newVideoButtonName = type === 'Echo360' ? 
          <><i class="fas fa-link"></i>&ensp;Add New Video from Echo360</> :
          <><i class="fas fa-cloud-upload-alt"></i>&ensp;Upload Video</>

  return (
    <div className="playlist-btn">
      {
        type !== 'YouTube'
        &&
        <Button 
          color='grey'
          className="new-btn" 
          onClick={()=>1} 
          aria-label="new video"
        >
          {newVideoButtonName}
        </Button>
      }
      <Button 
        className="edit-btn" 
        onClick={()=>util.editPlaylist('fakeid')} 
        aria-label="edit playlist"
      >
        <i class="fas fa-edit"></i>&ensp;Edit Playlist
      </Button>
    </div>
  )
}

/**
 *  Buttons for editing current video 
 */
function EditVideoButtons({show, video}) {
  const display = show ? {} : {display: 'none'}
  return (
    <List.Content floated='right' className="list-dropdown-btn" style={display}>
      <Dropdown 
        icon="ellipsis vertical" 
        floating direction="left" 
        aria-label={`Dropdown Buttons for Video ${video}`}
        title="edit"
      >
        <Dropdown.Menu >
          <Dropdown.Item 
            icon="edit" text='Edit' 
            onClick={()=>util.editVideo('fakeid')}
            aria-label="edit"
          />
          <Dropdown.Item 
            icon="trash" text='Delete' 
            onClick={()=>1}
            aria-label="delete"
          />
        </Dropdown.Menu>
      </Dropdown>
    </List.Content>
  )
}


function NoVideoWrapper() {
  return (
    <div className="novideo-wrapper">
      <h4>
        Upload Your First Lecture Video&ensp;
        <i class="fas fa-cloud-upload-alt"></i>
      </h4>
    </div>
  )
}
