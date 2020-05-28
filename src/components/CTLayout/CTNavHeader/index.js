import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

import { CTBrand } from './CTBrand';
import UserMenu from './NavHeaderMenu';

/**
 * Navigation Header
 */
export function CTNavHeader(props) {
  let {
    // children
    brandElem = null,
    subtitle = null,
    leftElem = null,
    children = null,
    rightElem = null,
    // profile menu
    showProfileMenu = true,
    // styles
    darkMode = false,
    fixed = false,
    sticky = false,
    bordered = false,
  } = props;

  const hasExtenalBrandElem = Boolean(brandElem);
  if (!hasExtenalBrandElem) {
    brandElem = <CTBrand darkMode={darkMode} />
  }

  const headerClasses = classNames({
    'ct-nav-dark': darkMode,
    'pl-3': !hasExtenalBrandElem,
    fixed,
    sticky,
    bordered
  });

  return (
    <nav id="ct-nav-header" className={headerClasses}>
      {/* Right Elem */}
      <div className="ct-header-left-elem">
        {brandElem}

        {subtitle && <div className="ct-h-subtitle">{subtitle}</div>}

        {leftElem}
      </div>

      {/* Left Elem */}
      <div className="ct-header-right-elem">
        {children}
        {rightElem}

        {showProfileMenu && <UserMenu darkMode={darkMode} />}
      </div>
    </nav>
  );
}

export const CTNavHeaderPropsTypes = {
  /** Brand element */
  brandElem: PropTypes.node,

  /** Left side element */
  leftElem: PropTypes.node,

  /** Subtitle element */
  subtitle: PropTypes.node,

  /** Default as right side element */
  children: PropTypes.node,

  /** Right side element */
  rightElem: PropTypes.node,

  /** The Nav Header supports profile menu */
  showProfileMenu: PropTypes.bool,
  
  /** The Nav Header supports dark mode */
  darkMode: PropTypes.bool,

  /** The Nav Header `can display: fixed;` */
  fixed: PropTypes.bool,

  /** The Nav Header can has a bottom border */
  bordered: PropTypes.bool
};

CTNavHeader.propTypes = CTNavHeaderPropsTypes;

// Sub components
CTNavHeader.Brand = CTBrand;
