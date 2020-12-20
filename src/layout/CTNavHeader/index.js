import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CTFragment from '../CTFragment';
import { CTBrand } from './CTBrand';
import { NavHeaderTabPanel, NavHeaderTabPanelPropsTypes } from './NavHeaderTabPanel';
import UserMenu from './NavHeaderMenu';
import { NavHeaderSearch } from './NavHeaderSearch'
import { createCTNavHeaderProps } from './create-props';
import './index.scss';

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
    toolbarElem,
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
    className,
    // search
    search = false
  } = props;

  const hasExtenalBrandElem = Boolean(brandElem);
  if (!hasExtenalBrandElem) {
    brandElem = <CTBrand darkMode={darkMode} />
  }

  const hasToolbarElem = Boolean(toolbarElem);
  const hasTabs = tabs.length > 0;

  const headerClasses = classNames({
    'ct-nav-dark': darkMode,
    'pl-3': !hasExtenalBrandElem,
    tabHeader: hasTabs,
    toolbarHeader: hasToolbarElem,
    fixed,
    sticky,
    bordered,
    shadowed
  }, className);

  return (
    <nav id="ct-nav-header" className={headerClasses}>
      <CTFragment alignItCenter justConBetween>
        {brandElem}
        {search && <NavHeaderSearch />}
        {/* Right Elem */}
        <CTFragment dFlexCol>
          <CTFragment dFlex id="ct-nh-primary">
            <CTFragment alignItCenter className="ct-header-left-elem">
              {subtitle && <div className="ct-h-subtitle">{subtitle}</div>}

              {leftElem}
            </CTFragment>

            {/* Left Elem */}
            <CTFragment alignItCenter justConEnd className="ct-header-right-elem">
              {children}
              {rightElem}
              {showProfileMenu && <UserMenu darkMode={darkMode} />}
            </CTFragment>
          </CTFragment>

          {hasToolbarElem && <CTFragment dFlex>{toolbarElem}</CTFragment>}
        </CTFragment>
      </CTFragment>

      {hasTabs && <NavHeaderTabPanel tabs={tabs} tabTitleElem={tabTitleElem} />}
    </nav>
  );
}

export const CTNavHeaderPropsTypes = {
  /** Additional classes */
  className: PropTypes.string,

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

  toolbarElem: PropTypes.node,

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