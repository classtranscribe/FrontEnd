/**
 * The component for Instructor Offering Page
 * contains the video list and editing buttons
 */

import React from 'react'
import { Tab } from 'react-bootstrap'
import { List, Image, Dropdown as UIDropdown, Button as UIButton } from 'semantic-ui-react'
import { FixedFooter } from '../../../../components'
import { util } from '../../../../util'
const profileImg = require('../../../../images/icons/profile1.png')

export function VideoList({playlists}) {
  return (
    <Tab.Content className="csp-videos">
      {playlists.map( list => (
          <Tab.Pane eventKey={list.name}>            
            <EditPlaylistBtns />
            {list.videos.length ? 
              <List verticalAlign='middle' className="vlist">
                {list.videos.map( video => (
                  <List.Item className="video-card">
                    <EditVideoButtons />

                  {/* The video Info */}
                    <Image 
                      className="img" 
                      onClick={()=>util.watch()} // to video page
                      src={profileImg}
                    />
                    <List.Content>
                      <div className="info">
                        <p className="title" 
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

/**
 *  Buttons for editing current playlist 
 */
function EditPlaylistBtns({}) {
  return (
    <div className="playlist-btn">
      <UIButton 
        color='linkedin'
        className="new-btn" 
        onClick={()=>1} 
      >
        <i class="fas fa-cloud-upload-alt"></i>&ensp;Upload Video
      </UIButton>
      <UIButton 
        className="edit-btn" 
        onClick={()=>util.editPlaylist('mlmlmlml')} 
      >
        <i class="fas fa-edit"></i>&ensp;Edit Playlist
      </UIButton>
    </div>
  )
}

/**
 *  Buttons for editing current video 
 */
function EditVideoButtons({}) {
  return (
    <List.Content floated='right' className="list-dropdown-btn">
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
