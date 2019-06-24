import React from 'react';
import { ListGroup, Tab } from 'react-bootstrap';

function PlaylistBar(props) {
  const sidebarStyle = {right: props.right};
  const offering = props.offering;
  const playlists = offering.playlists;

  function Playlist() {
    return (
      <div className="playlist" >
        <ListGroup.Item className='header'>
          <div style={{width: '10rem', display: 'inline-flex'}}>Playlists</div>
        </ListGroup.Item>
        <ListGroup className="list" variant="flush">
          { playlists.map( (playlist, index) => (
            <ListGroup.Item 
              variant="secondary" 
              action eventKey={playlist.name}
              onClick={ ()=>props.setCurrPlaylist(index) }
            >
              <p className="name"><i class="fas fa-list-alt"></i> {playlist.name}</p>
              <p className="num">{playlist.videos.length} video(s)</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    )
  }

  function VideoList() {
    return (
      <Tab.Content className="videolist">
        {playlists.map(playlist => (
          <Tab.Pane eventKey={playlist.name}>
            <ListGroup.Item className='header'>
              {playlist.name}
            </ListGroup.Item>

            <ListGroup variant="flush" className="list">
              {playlist.videos.map( video => (
                <ListGroup.Item  variant="dark" action eventKey={video}>
                  <p className="name"><i class="fas fa-video"></i> {video}</p>
                  <p className="num">0:05:20</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Tab.Pane>
        ))}
      </Tab.Content>
    )
  }

  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey={playlists[props.currPlaylist].name}>
      <div className="pl-sidebar" style={sidebarStyle}>
        <Playlist />
        <VideoList />
      </div>
    </Tab.Container>
  )
}

export default PlaylistBar;