/**
 * The component for Instructor Offering Page
 * contains the playlists and menus
 */
import React from 'react'
import { Button, ListGroup } from 'react-bootstrap'
import { util, api, handleData } from '../../../util'
const { initialCourse, initialOffering } = api.initialData

export function SideBar({id, playlists, state: {displaySideBar, term, courseOffering}}) {
  // style for showing or hiding the sidebar
  const style = {marginLeft: displaySideBar ? '0' : '-20rem'}
  // get complete courseNumber based on an array of courses (e.g. CS425/ECE428)
  const courseNumber = courseOffering.courses ? handleData.getCompleteCourseNumber(courseOffering.courses) : ''
  // aviod undefined behaviors
  const course = courseOffering.courses ? courseOffering.courses[0] : initialCourse
  const offering = courseOffering ? courseOffering.offering : initialOffering

  return (
    <div className="course-sidebar" style={style}>
      <ListGroup>
        {/* Go Back Menu Item */}
        <ListGroup.Item className="list" onClick={util.toInstructorPage}>
          <i class="fas fa-chevron-left"></i> &ensp; My Courses<br/><br/>
        </ListGroup.Item>
        {/* Offering Info ---click to editing page */}
        <ListGroup.Item className="details" action onClick={()=>util.editOffering(id)}>
          <p className="title">
            <i class="fas fa-book"></i> &ensp; {courseNumber}
            &ensp; <i class="fas fa-edit"></i>
          </p>
          <li className="name">{course.courseName}</li>
          <li className="name">{term.name}</li>
          <li className="sec"><strong>Section</strong> {offering.sectionName}</li>
        </ListGroup.Item>
        {/* Data demo menu item */}
        <ListGroup.Item className="list" eventKey="data">
          <i class="fas fa-chart-bar"></i> &ensp; Data
        </ListGroup.Item>
      </ListGroup>

      <Playlist playlists={playlists}/>
    </div>
  )
}

/**
 * Playlist Tabs
 */
function Playlist({playlists}) {
  // Show when there is no playlists yet
  const NoPlaylistWrapper = (
    <div className="noplaylist-wrapper">
      <h4>EMPTY</h4>
    </div>
  )

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
          {playlists.map( playlist => 
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