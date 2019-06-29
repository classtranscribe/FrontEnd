import React from 'react'
import { Tab } from 'react-bootstrap'
import { List, Image, Dropdown as UIDropdown, Button as UIButton } from 'semantic-ui-react'
import { FixedFooter } from '../../../components'
// Vars
import { util } from '../../../util'

export function Videos(props) {

  return (
    <Tab.Content className="csp-videos">
      {props.playlists.map( list => (
          <Tab.Pane eventKey={list.name}>            
            <EditPlaylistBtns />

{/* course list in the playlist */}
            {list.videos.length ? 
              <List verticalAlign='middle' className="vlist">
                {list.videos.map( video => (
                  <List.Item className="video-card">
                    <EditVideoButtons />
        {/* The video Info */}
                    <Image 
                      className="img" 
                      onClick={()=>util.watch()}
                      src={require('../../../images/icons/profile1.png')}
                    />
                    <List.Content>
                      <div className="info">
                        <p className="title" 
                          onClick={()=>util.watch()}
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
function EditPlaylistBtns(props) {
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

function EditVideoButtons(props) {
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
