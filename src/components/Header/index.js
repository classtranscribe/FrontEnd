import React from 'react'
import { Row, Navbar } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import ProfileBtn from './ProfileBtn'
import './index.css'

/**
 * Header only for Course Setting Page with a sider bar show-up trigger button
 * @param props 
 * user: {name, ...}
 * showSiderBar: function for display or hide side bar
 */
export function ClassTranscribeHeader({darkMode, showSiderBar, onSignOut, display}) {
  const bg = darkMode ? 'dark' : 'light';
  const location =  window.location.toString()

  const sidebarTrggerTitle = display ? "Hide Sidebar" : "Show Sidebar"
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
      <Navbar.Brand className="brand" href="/" title="brand" aria-label="brand">
        ClassTranscribe
      </Navbar.Brand>
      <Row className="signout">
        <ProfileBtn onSignOut={onSignOut}/>
      </Row>
    </Navbar>
  )
}