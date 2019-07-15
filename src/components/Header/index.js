import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Navbar } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import ProfileBtn from './ProfileBtn'
import './index.css'
import { user, util } from '../../util'

/**
 * Header only for Course Setting Page with a sider bar show-up trigger button
 * @param props 
 * user: {name, ...}
 * showSiderBar: function for display or hide side bar
 */
export function ClassTranscribeHeader({darkMode, showSiderBar, onSignOut, display}) {
  const bg = darkMode ? 'dark' : 'light';
  const sidebarTrggerTitle = display ? "Hide Sidebar" : "Show Sidebar"
  const homeURL = user.isLoggedIn() ? util.links.studentHome() : util.links.home()
  return (
    <Navbar sticky="top" bg={bg} variant={bg} className={`ct-nav ${bg}`}>
      {
        showSiderBar 
        &&
        <Navbar.Brand 
          className="sidebar-trigger" 
          aria-label={sidebarTrggerTitle}
          title={sidebarTrggerTitle}
          onClick={showSiderBar} 
          disabled
        >
          <Icon name='sidebar' size="large"/>
        </Navbar.Brand>
      }
      <Navbar.Brand className="brand" as={Link} to={homeURL} title="brand" aria-label="brand">
        <img
          src={require('../../images/ct-logo.png')}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="ClassTranscribe logo"
        />
        &ensp;ClassTranscribe
      </Navbar.Brand>
      <Row className="signout">
        <ProfileBtn onSignOut={onSignOut}/>
      </Row>
    </Navbar>
  )
}