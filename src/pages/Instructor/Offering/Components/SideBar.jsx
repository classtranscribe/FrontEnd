/**
 * The component for Instructor Offering Page
 * contains the playlists and menus
 */
import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { Icon, Button } from 'semantic-ui-react'
import { GeneralPlaceholder } from '../../../../components'
import { util, api, handleData } from '../../../../util'
const { initialCourse, initialOffering } = api.initialData

export function SideBar({id, playlists, setActivePane, state}) {
  const {displaySideBar, term, courseOffering, loadingOfferingInfo} = state;
  // style for showing or hiding the sidebar
  const style = {marginLeft: displaySideBar ? '0' : '-20rem'}
  // get complete courseNumber based on an array of courses (e.g. CS425/ECE428)
  const courseNumber = courseOffering.courses ? handleData.getCompleteCourseNumber(courseOffering.courses) : ''
  // aviod undefined behaviors
  const course = courseOffering.courses ? courseOffering.courses[0] : initialCourse
  const offering = courseOffering ? courseOffering.offering : initialOffering

  return (
    <div className="op-sidebar" style={style}>
      <ListGroup>
        {/* Go Back Menu Item */}
        <ListGroup.Item className="list" onClick={util.toInstructorPage}>
          <i class="fas fa-chevron-left"></i> &ensp; My Courses<br/><br/>
        </ListGroup.Item>

        {/* Offering Info ---click to editing page */}
        {
          loadingOfferingInfo ? (
            <GeneralPlaceholder fluid 
              lines={['full', 'long', 'medium', 'short', 'short', 'very short']} 
            />
          ) : (
            <ListGroup.Item className="details" action onClick={()=>util.editOffering(id)}>
              <p className="title">
                <i class="fas fa-book"></i> &ensp; {courseNumber}
                &ensp; <i class="fas fa-edit"></i>
              </p>
              <p className="name"><Icon name="circle outline" /><strong>{course.courseName}</strong></p>
              <p className="name"><Icon name="circle outline" />{term.name}</p>
              <p className="sec"><Icon name="circle outline" /><strong>Section</strong> {offering.sectionName}</p>
            </ListGroup.Item>
          )
        }
        
        {/* Data demo menu item */}
        <ListGroup.Item className="list" eventKey="data">
          <i class="fas fa-chart-bar"></i> &ensp; Data
        </ListGroup.Item>
      </ListGroup>

      <Playlist playlists={playlists} id={id} setActivePane={setActivePane}/>
    </div>
  )
}

/**
 * Playlist Tabs
 */
function Playlist({playlists, id, setActivePane}) {
  // Show when there is no playlists yet
  const NoPlaylistWrapper = (
    <div className="noplaylist-wrapper">
      <h4>EMPTY</h4>
    </div>
  )

  const getColor = type => {
    return type === 'YouTube' ? 'red' : 
           type === 'Echo360' ? 'blue' : 'black'
  }

  const getIcon = type => {
    return type === 'YouTube' ? 'youtube' : 
           type === 'Echo360' ? 'video play' : 'file video'
  }

  return (
    <div className="playlists">
      <div className="breakline"></div>
      <ListGroup.Item className="title">
        <i class="fas fa-list-ul"></i> &ensp; Playlists
      </ListGroup.Item>
      
      <Button color="black" className="new-pl-btn" onClick={()=>util.newPlaylist(id)}>
        <i class="fas fa-folder-plus"/> New Playlist
      </Button>
      { playlists.length ? 
        <ListGroup className="playlist">
          {playlists.map( playlist => 
            <ListGroup.Item 
              variant="secondary" className="item" 
              key={playlist.name}
              action eventKey={playlist.name} // should be playlist id
              onClick={()=>setActivePane(playlist.name)} // should be playlist id
            >
              <p className="pl-name">
                <Icon name={getIcon(playlist.type)} color={getColor(playlist.type)} /> 
                &ensp;{playlist.name}
              </p>
              <p className="pl-video-num">{playlist.videos.length} video(s)</p>
            </ListGroup.Item>
          )}
        </ListGroup> : <NoPlaylistWrapper />
      }
    </div>
  )
}