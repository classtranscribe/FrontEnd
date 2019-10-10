/**
 * The component for Instructor Offering Page
 * contains the playlists and menus
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'
import { Button } from 'semantic-ui-react'
import { util, api } from 'utils'
import TypeIcon from './TypeIcon'

export function SideBar({ id, state, showSiderBar }) {
  const { displaySideBar, courseOffering, playlists } = state;
  // style for showing or hiding the sidebar
  const style = {marginLeft: displaySideBar ? '0' : '-20rem'}

  var fullNumber = 'Loading...'
  var fittedName = 'Loading...'
  var courseName = ''
  var termName = ''
  var sectionName = ''
  // get info from the courseOffering
  const { courses, offering } = courseOffering
  if (courses) {
    fullNumber = api.getFullNumber(courses)
    fittedName = fullNumber.slice(0, 14)
    if (fittedName !== fullNumber) fittedName += '...'
    courseName = courses[0].courseName
  }
  if (offering && offering.termName) {
    termName = offering.termName
    sectionName = offering.sectionName
    util.links.title(fullNumber+' • '+termName+' • '+sectionName)
  }

  return (
    <div className="op-sidebar" style={style}>
      <ListGroup defaultActiveKey={window.location.pathname.includes('data') ? 'data' : ''}>
        {/* Go Back Menu Item */}
        <ListGroup.Item 
          as={Link}
          className="list goback" 
          to={util.links.instructor()} 
          aria-label="go back" title="go back"
        >
          <i className="fas fa-chevron-left"></i> &ensp; My Courses<br/><br/>
        </ListGroup.Item>

        {/* Offering Info ---click to editing page */}
        <ListGroup.Item 
          as={Link}
          className="list" 
          to={util.links.editOffering(id)} 
          aria-label="Edit offering"
          title={`Edit offering: ${fullNumber}`}
        >
          <p className="title">
            <i className="fas fa-book"></i> &ensp; {fittedName}
            &ensp; <i className="fas fa-edit"></i>
          </p>
        </ListGroup.Item>
        <ListGroup.Item className="list" disabled>
          <p className="name">
            <strong>{courseName}</strong>
          </p>
          <p className="name sec">
            {termName}&ensp;{sectionName}
          </p>
        </ListGroup.Item>
        
        {/* Data demo menu item */}
        <ListGroup.Item 
          as={Link} to={util.links.offeringData(id)}
          onClick={() => showSiderBar(window.innerWidth > 900)}
          className="list" eventKey="data" aria-label="data" title="data" eventKey="data"
        >
          <i className="fas fa-chart-bar"></i> &ensp; Analytics
        </ListGroup.Item>
      </ListGroup>

      <Playlist playlists={playlists} id={id} fullNumber={fullNumber} showSiderBar={showSiderBar} />
    </div>
  )
}

/**
 * Playlists
 */
function Playlist({ playlists, id, fullNumber, showSiderBar }) {
  if (!playlists.length) return null
  // Show when there is no playlists yet
  const NoPlaylistWrapper = (
    <div className="noplaylist-wrapper">
      <h4>EMPTY</h4>
    </div>
  )

  const defaultActiveKey = window.location.pathname.includes('=') ? window.location.pathname.split('=')[1] : playlists[0].id

  return (
    <div className="playlists">
      <div className="breakline"></div>
      <ListGroup.Item className="title">
        <i className="fas fa-list-ul"></i> &ensp; Playlists
      </ListGroup.Item>
      
      <Button as={Link} className="new-pl-btn" to={util.links.newPlaylist(id)}>
        <i className="fas fa-folder-plus"/> New Playlist
      </Button>
      { playlists.length ? 
        <ListGroup className="playlist" defaultActiveKey={defaultActiveKey}>
          {playlists.map( playlist => 
            <ListGroup.Item 
              as={Link} to={{
                pathname: util.links.offeringPlaylist(id, api.getValidURLFullNumber(fullNumber), playlist.id),
                state: { playlist: playlist }
              }}
              onClick={() => showSiderBar(window.innerWidth > 900)}
              variant="secondary" className="item" action 
              key={playlist.id} eventKey={playlist.id}
              aria-label={playlist.name}
              title={`see videos of playlist '${playlist.name}'`}
            >
              <p className="pl-name">
                <TypeIcon type={playlist.sourceType} />
                &ensp;{playlist.name}
              </p>
              <p className="pl-video-num">{playlist.medias.length} video(s)</p>
            </ListGroup.Item>
          )}
        </ListGroup> : <NoPlaylistWrapper />
      }
    </div>
  )
}