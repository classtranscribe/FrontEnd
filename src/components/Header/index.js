import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button } from 'pico-ui'
import ProfileMenu from './ProfileMenu'
import './index.scss'
import { util } from '../../utils'
import { textBrand, darkTextBrand } from '../../images'

/**
 * Header only for Course Setting Page with a sider bar show-up trigger button
 */
export function ClassTranscribeHeader({
  display=false, 
  showSiderBar=false, 
  children=null, 
  rightElem=null,
  leftElem=null,
  subtitle=null,
  showProfileMenu=true,

  darkMode=false, 
  fixed=true,
  bordered=false,
}) {
  const bg = darkMode ? 'ct-nav-dark' : 'ct-nav-light'
  const sidebarTrggerTitle = display ? "Hide Sidebar" : "Show Sidebar"
  const homeURL = util.links.home()
  const imgSrc = darkMode ? darkTextBrand : textBrand

  if (children !== null) rightElem = children

  return (
    <nav 
      id="ct-nav" 
      bg={bg} 
      variant={bg} 
      className={`ct-nav ${
        bg 
        + (fixed ? ' fixed' : '')
        + (bordered ? ' bordered' : '')
      }`}
    >
      {/* Right Elem */}
      <div className="ct-header-left-elem">
        { /* Sidebar trigger */
          showSiderBar 
          &&
          <Button round compact
            classNames="ct-header-sidebar-trigger"
            color="transparent"
            icon={<i className="fas fa-bars"></i>}
            aria-label={sidebarTrggerTitle}
            onClick={showSiderBar}
          />
        }
        {/* Brand */}
        <Link className={"ct-header-brand" + (showSiderBar ? '' : ' ml-3')} to={homeURL}>
          <img
            src={imgSrc}
            alt="ClassTranscribe Brand"
          />
        </Link>
        <div className="ct-h-subtitle">
          {subtitle}
        </div>
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

ClassTranscribeHeader.propTypes = {
  darkMode: PropTypes.bool,
  showSiderBar: PropTypes.func,
  display: PropTypes.bool,
  onSignOut: PropTypes.func
}