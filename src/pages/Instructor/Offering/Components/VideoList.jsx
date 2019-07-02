/**
 * The component for Instructor Offering Page
 * contains the video list and editing buttons
 */

import React from 'react'
import { Tab } from 'react-bootstrap'
import { List, Image, Dropdown as UIDropdown, Button as UIButton, Message, Header, Icon } from 'semantic-ui-react'
import { FixedFooter } from '../../../../components'
import { util } from '../../../../util'
const profileImg = require('../../../../images/Video-Placeholder.jpg')

const getIcon = type => {
  return type === 'YouTube' ? 'youtube' : 
         type === 'Echo360' ? 'video play' : 'file video'
}

export function VideoList({playlists}) {

  return (
    <Tab.Content className="csp-videos">
      {playlists.map( playlist => (
          <Tab.Pane eventKey={playlist.name}>  
            <PlaylistInfoHeader playlist={playlist} />          
            {playlist.videos.length ? 
              <List verticalAlign='middle' className="vlist">
                {playlist.videos.map( video => (
                  <List.Item className="video-card">
                    <EditVideoButtons show={playlist.type !== 'YouTube'} />

                  {/* The video Info */}
                    <Image 
                      className="img" 
                      onClick={()=>util.watch()} // to video page
                      src={profileImg}
                    />
                    <List.Content>
                      <div className="info">
                        <p className={`title ${playlist.type.toLowerCase()}`} 
                          onClick={()=>util.watch()} // to video page
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
      <p className={`name ${type.toLowerCase()}`}>
        <Icon size='big' name={getIcon(type)}/>
        &ensp;{name}
      </p> 
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
        <UIButton 
          color='grey'
          className="new-btn" 
          onClick={()=>1} 
        >
          {newVideoButtonName}
        </UIButton>
      }
      <UIButton 
        className="edit-btn" 
        onClick={()=>util.editPlaylist('fakeid')} 
      >
        <i class="fas fa-edit"></i>&ensp;Edit Playlist
      </UIButton>
    </div>
  )
}

/**
 *  Buttons for editing current video 
 */
function EditVideoButtons({show}) {
  const display = show ? {} : {display: 'none'}
  return (
    <List.Content floated='right' className="list-dropdown-btn" style={display}>
      <UIDropdown icon="ellipsis vertical" floating direction="left">
        <UIDropdown.Menu style={{height: '5.4rem'}}>
          <UIDropdown.Item 
            icon="edit" text='Edit' 
            onClick={()=>util.editVideo('fakeid')}
          />
          <UIDropdown.Item 
            icon="trash" text='Delete' 
            onClick={()=>1}
          />
        </UIDropdown.Menu>
      </UIDropdown>
    </List.Content>
  )
}


function NoVideoWrapper() {
  return (
    <div className="novideo-wrapper">
      <h4>
        Please Upload Your First Lecture Video&ensp;
        <i class="fas fa-cloud-upload-alt"></i>
      </h4>
    </div>
  )
}
