import React from 'react'
import { Tab } from 'react-bootstrap'
import { List, Image, Dropdown as UIDropdown, Button as UIButton } from 'semantic-ui-react'
import { 
  FixedFooter, 
  UpLoadVideosContainer,
  GeneralAlert,
} from '../../components'

function Videos(props) {
  /* Buttons for editing current playlist */
  function EditPlaylistBtns() {
    return (
      <div className="playlist-btn">
        <UIButton 
          secondary className="edit-btn" 
          onClick={()=>props.onCloseOrOpen('editPlaylist')} 
        >
          <i class="fas fa-edit"></i>&ensp;Edit Playlist
        </UIButton>
        <UIButton 
          negative className="delete-btn" 
          onClick={()=>props.onCloseOrOpen('deletePlaylist')} 
        >
          <i class="fas fa-trash"></i>&ensp;Delete Playlist
        </UIButton>
      </div>
    )
  }

  function NoVideoWrapper() {
    return (
      <div className="novideo-wrapper">
        <h4>Please Upload Your First Lecture Video <i class="fas fa-cloud-upload-alt"></i></h4>
      </div>
    )
  }
  // call back function when setting the video info
  function handleVideoSetting(index, info) {
    props.setIndex('currVideoIdx', index);
    props.onCloseOrOpen(info);
  }

  return (
    <Tab.Content className="csp-videos">
      {props.playlists.map( list => (
          <Tab.Pane eventKey={list.name}>            
            <EditPlaylistBtns />

            <GeneralAlert 
              open={props.showAlert} 
              type={props.alertType}
              onClose={()=>props.onCloseOrOpen('alert')}
              width={100}
            />
            <UpLoadVideosContainer 
              onAlert={()=>props.onCloseOrOpen('alert')}
              onUploading={()=>props.onCloseOrOpen('uploading')}
              setAlert={props.setAlert}
            />

{/* course list in the playlist */}
            {list.videos.length ? 
              <List verticalAlign='middle' className="vlist">
                {list.videos.map( (video, index) => (
                  <List.Item className="video-card">
        {/* Bottons for editing each course */}
                    <List.Content floated='right' className="list-dropdown-btn">
                      <UIDropdown icon="ellipsis vertical" floating direction="left">
                        <UIDropdown.Menu style={{height: '5.4rem'}}>
                          <UIDropdown.Item 
                            icon="edit" text='Edit' 
                            onClick={()=>handleVideoSetting(index, 'editVideo')}
                          />
                          <UIDropdown.Item 
                            icon="trash" text='Delete' 
                            onClick={()=>handleVideoSetting(index, 'deleteVideo')}
                          />
                        </UIDropdown.Menu>
                      </UIDropdown>
                    </List.Content>
        {/* The video Info */}
                    <Image 
                      className="img" 
                      onClick={()=>window.location='/class-transcribe-frontend/#/video'}
                      src={require('../../images/icons/profile1.png')}
                    />
                    <List.Content>
                      <div className="info">
                        <p className="title" 
                          onClick={()=>window.location='/class-transcribe-frontend/#/video'}
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

export default Videos;