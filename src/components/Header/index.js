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
export function ClassTranscribeHeader({darkMode, showSiderBar, user, onSignOut}) {
  const bg = darkMode ? 'dark' : 'light';
  const location =  window.location.toString()
  const offeringPage = location.includes('/offering/')
  return (
    <Navbar aria-label="Top Nav Bar" sticky="top" bg={bg} variant={bg} className={`ct-nav ${bg}`}>
      {
        offeringPage 
        &&
        <Navbar.Brand className="sidebar-trigger" onClick={showSiderBar} disabled>
          <Icon name='sidebar' size="large"/>
        </Navbar.Brand>
      }
      <Navbar.Brand className="brand" href="/">ClassTranscribe</Navbar.Brand>
      <Row className="signout">
        <ProfileBtn user={user} onSignOut={onSignOut}/>
      </Row>
    </Navbar>
  )
}