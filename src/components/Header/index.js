import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Row, Navbar } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import ProfileMenu from './ProfileMenu'
import './index.css'
import { user, util } from 'utils'

/**
 * Header only for Course Setting Page with a sider bar show-up trigger button
 * @param props 
 * user: {name, ...}
 * showSiderBar: function for display or hide side bar
 */
export function ClassTranscribeHeader({darkMode, showSiderBar, onSignOut, display, children}) {
  const bg = darkMode ? 'dark' : 'light'
  const sidebarTrggerTitle = display ? "Hide Sidebar" : "Show Sidebar"
  const homeURL = user.isLoggedIn() ? util.links.studentHome() : util.links.home()
  const isWatchScreen = window.location.pathname.includes('/video/')
  return (
    <Navbar id="ct-nav" sticky="top" bg={bg} variant={bg} className={`ct-nav ${bg}`}>
      {
        showSiderBar 
        &&
        <Navbar.Brand 
          className="sidebar-trigger" as="button"
          aria-label={sidebarTrggerTitle}
          title={sidebarTrggerTitle}
          onClick={showSiderBar} 
        >
          <Icon name='sidebar' size="large"/>
        </Navbar.Brand>
      }
      <Navbar.Brand id="brand" className="brand" as={Link} to={homeURL} title="brand" aria-label="brand">
        {!isWatchScreen && <Logo />}
        <span>C</span>lass<span>T</span>ranscribe
      </Navbar.Brand>
      <Row className="signout">
        {children}
        <ProfileMenu onSignOut={onSignOut} isWatchScreen={isWatchScreen} darkMode={darkMode}/>
      </Row>
    </Navbar>
  )
}

function Logo() {
  return (
    <>
    <img
      src={require('../../images/ct-logo.png')}
      width="30" height="30"
      className="d-inline-block align-top img"
      alt="ClassTranscribe logo"
    />&ensp;
    </>
  )
}

ClassTranscribeHeader.propTypes = {
  darkMode: PropTypes.bool,
  showSiderBar: PropTypes.func,
  display: PropTypes.bool,
  onSignOut: PropTypes.func
}