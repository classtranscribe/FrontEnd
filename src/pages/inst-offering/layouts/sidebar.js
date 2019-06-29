import React from 'react'
import { Button, ListGroup, OverlayTrigger, Popover } from 'react-bootstrap'
import { util } from '../../../util';

export function SideBar(props) {
  const { course, offering } = props;
  const { displaySideBar } = props.state;
  const display = {marginLeft: displaySideBar ? '0' : '-20rem'}
  return (
    <div className="course-sidebar" style={display}>
      <ListGroup>
        <ListGroup.Item className="list" onClick={util.toInstructorPage}>
          <i class="fas fa-chevron-left"></i> &ensp; My Courses<br/><br/>
        </ListGroup.Item>

        <OverlayTrigger 
          key='right' placement='top-end'
          overlay={
            <Popover><p>Click to Edit the Offering</p></Popover>
          }
        >
          <ListGroup.Item 
            className="details" action 
            onClick={()=>util.editOffering('fakeid')}
          >
            <p className="title">
              <i class="fas fa-book"></i> &ensp; {course.courseNumber}
              &ensp;{offering.term}
            </p>
            <p className="name">{course.courseName}</p>
            <p className="sec"><strong>Section</strong> {offering.sec}</p>
          </ListGroup.Item>
        </OverlayTrigger>

        <ListGroup.Item className="list" eventKey="data">
          <i class="fas fa-chart-bar"></i> &ensp; Data
        </ListGroup.Item>

      </ListGroup>
      <Playlist {...props}/>
    </div>
  )
}

function Playlist(props) {
  const { playlists } = props;
  function NoPlaylistWrapper() {
    return (
      <div className="noplaylist-wrapper">
        <h4>EMPTY</h4>
      </div>
    )
  }
  return (
    <div className="playlists">
      <div className="breakline"></div>
      <ListGroup.Item className="title">
        <i class="fas fa-list-ul"></i> &ensp; Playlists
      </ListGroup.Item>
      <Button variant="outline-dark" className="new-pl-btn" onClick={()=>util.newPlaylist('fakeid')}>
        <i class="fas fa-folder-plus"/> New Playlist
      </Button>
      { playlists.length ? 
        <ListGroup className="playlist">
          {playlists.map( (playlist, index) => 
            <ListGroup.Item 
              variant="secondary" className="item" 
              action eventKey={playlist.name}
              onClick={()=>1}
            >
              <p className="pl-name">{playlist.name}</p>
              <p>{playlist.videos.length} video(s)</p>
            </ListGroup.Item>
          )}
        </ListGroup> : <NoPlaylistWrapper />
      }
    </div>
  )
}