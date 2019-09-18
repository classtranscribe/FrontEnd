import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Row, Navbar } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import ProfileMenu from './ProfileMenu'
import './index.css'
import { util } from 'utils'

/**
 * Header only for Course Setting Page with a sider bar show-up trigger button
 */
export function ClassTranscribeHeader({darkMode, display, showSiderBar, children, universities}) {
  const bg = darkMode ? 'dark' : 'light'
  const sidebarTrggerTitle = display ? "Hide Sidebar" : "Show Sidebar"
  const homeURL = util.links.home()
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
      <Navbar.Brand id="brand" className="ct-brand" as={Link} to={homeURL} title="Home" aria-label="Home">
        {
          darkMode ?
          <><span>C</span>lass<span>T</span>ranscribe</>
          :
          <Logo />
        }
      </Navbar.Brand>
      <Row className="signout">
        {children}
        <ProfileMenu darkMode={darkMode} universities={universities} />
      </Row>
    </Navbar>
  )
}

export function Logo() {
  return (
    <>
      <img
        src={require('../../images/brand-text.png')}
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