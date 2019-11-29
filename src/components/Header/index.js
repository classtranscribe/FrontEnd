import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Row, Navbar } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import ProfileMenu from './ProfileMenu'
import './index.css'
import { util } from 'utils'
import { textBrand, darkTextBrand } from '../../images'

/**
 * Header only for Course Setting Page with a sider bar show-up trigger button
 */
export function ClassTranscribeHeader({
  darkMode=false, 
  display=false, 
  showSiderBar=false, 
  children=null, 
  rightElem=null,
  leftElem=null,
  subtitle=null,
  showProfileMenu=true,
}) {
  const bg = darkMode ? 'ct-nav-dark' : 'ct-nav-light'
  const sidebarTrggerTitle = display ? "Hide Sidebar" : "Show Sidebar"
  const homeURL = util.links.home()
  const imgSrc = darkMode ? darkTextBrand : textBrand

  if (children !== null) rightElem = children

  return (
    <nav id="ct-nav" sticky="top" bg={bg} variant={bg} className={`ct-nav ${bg}`}>
      {/* Right Elem */}
      <div className="ct-header-left-elem">
        { /* Sidebar trigger */
          showSiderBar 
          &&
          <button 
            className="plain-btn ct-header-sidebar-trigger"
            aria-label={sidebarTrggerTitle}
            onClick={showSiderBar}
          >
            <span tabIndex="-1">
              <i class="fas fa-bars"></i>
            </span>
          </button>
        }
        {/* Brand */}
        <Link className="ct-header-brand" to={homeURL}>
          <img
            src={imgSrc}
            alt="ClassTranscribe Brand"
          />
        </Link>
        {subtitle}
        {leftElem}
      </div>

      {/* Left Elem */}
      <div className="ct-header-right-elem">
        {rightElem}
        {showProfileMenu && <ProfileMenu darkMode={darkMode} />}
      </div>
    </nav>
  )
}

function Logo({ subtitle, darkMode }) {
  return (
    <img
      src={darkTextBrand}
      width="30" height="30"
      className="ct-header-brand-img"
      alt="ClassTranscribe Brand"
    />
  )
}

ClassTranscribeHeader.propTypes = {
  darkMode: PropTypes.bool,
  showSiderBar: PropTypes.func,
  display: PropTypes.bool,
  onSignOut: PropTypes.func
}