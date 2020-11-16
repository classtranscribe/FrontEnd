import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

import { CTBrand } from './CTBrand';
import { NavHeaderTabPanel, NavHeaderTabPanelPropsTypes } from './NavHeaderTabPanel';
import UserMenu from './NavHeaderMenu';
import { NavHeaderSearch } from './NavHeaderSearch'
import { createCTNavHeaderProps } from './create-props';

/**
 * Navigation Header
 */
function CTNavHeader(props) {
  let {
    // children
    brandElem,
    subtitle,
    leftElem,
    children,
    rightElem,
    // tabs
    tabs = [],
    tabTitleElem,
    // profile menu
    showProfileMenu = true,
    // styles
    darkMode = false,
    fixed = false,
    sticky = false,
    bordered = false,
    shadowed = false,
    // search
    search = false
  } = props;

  const hasExtenalBrandElem = Boolean(brandElem);
  if (!hasExtenalBrandElem) {
    brandElem = <CTBrand darkMode={darkMode} />
  }

  const headerClasses = classNames({
    'ct-nav-dark': darkMode,
    'pl-3': !hasExtenalBrandElem,
    tabHeader: tabs.length > 0,
    fixed,
    sticky,
    bordered,
    shadowed
  });

  return (
    <nav id="ct-nav-header" className={headerClasses}>
      <div id="ct-nh-primary">
        {/* Right Elem */}
        <div className="ct-header-left-elem">
          {brandElem}
          {search && <NavHeaderSearch />}
          {subtitle && <div className="ct-h-subtitle">{subtitle}</div>}

          {leftElem}
        </div>

        {/* Left Elem */}
        <div className="ct-header-right-elem">
          {children}
          {rightElem}

          {showProfileMenu && <UserMenu darkMode={darkMode} />}
        </div>
      </div>

      {
        tabs.length > 0
        &&
        <NavHeaderTabPanel tabs={tabs} tabTitleElem={tabTitleElem} />
      }
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

  /** The Nav Header can have nav tabs */
  tabs: NavHeaderTabPanelPropsTypes.tabs,

  /** The Nav Header can have a title element for tabs */
  tabTitleElem: NavHeaderTabPanelPropsTypes.tabTitleElem,

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
CTNavHeader.createProps = createCTNavHeaderProps;
export { CTBrand } from './CTBrand';
export {
  default as SignInButton,
  useSignButtonProps
} from './NavHeaderMenu/SignInButton';

export default CTNavHeader;