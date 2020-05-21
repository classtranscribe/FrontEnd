import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Button } from 'pico-ui';
import { util } from 'utils';
import './index.scss';

import { textBrand, darkTextBrand } from 'assets/images';

import UserMenu from './UserMenu';

/**
 * Header only for Course Setting Page with a sider bar show-up trigger button
 */
export function ClassTranscribeHeader({
  display = false,
  showSiderBar = false,
  children = null,
  rightElem = null,
  leftElem = null,
  subtitle = null,
  showProfileMenu = true,

  darkMode = false,
  fixed = true,
  bordered = false,
}) {
  const sidebarTrggerTitle = display ? 'Hide Sidebar' : 'Show Sidebar';
  const imgSrc = darkMode ? darkTextBrand : textBrand;

  if (children !== null) {
    rightElem = children;
  }

  const headerStyle = classNames('ct-nav', {
    'ct-nav-dark': darkMode,
    fixed,
    bordered,
  });

  const bandStyle = classNames('ct-header-brand', {
    'ml-3': !showSiderBar,
  });

  return (
    <nav id="ct-nav" className={headerStyle}>
      {/* Right Elem */}
      <div className="ct-header-left-elem">
        {showSiderBar && (
          <Button
            round
            compact
            classNames="ct-header-sidebar-trigger"
            color="transparent"
            icon={<i className="fas fa-bars" />}
            aria-label={sidebarTrggerTitle}
            onClick={showSiderBar}
          />
        )}

        <Link className={bandStyle} to={util.links.home()}>
          <img src={imgSrc} alt="ClassTranscribe Brand" />
        </Link>

        {subtitle && <div className="ct-h-subtitle">{subtitle}</div>}

        {leftElem}
      </div>

      {/* Left Elem */}
      <div className="ct-header-right-elem">
        {rightElem}

        {showProfileMenu && <UserMenu darkMode={darkMode} />}
      </div>
    </nav>
  );
}
