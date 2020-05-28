import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

import { ScrollArea } from 'components/ScrollArea';
import { CTNavHeader, CTNavHeaderPropsTypes } from './CTNavHeader';
import { CTNavSidebar, CTNavSidebarPropTypes } from './CTNavSidebar';
import NavSidebarTrigger from './NavSidebarTrigger';

/**
 * A general page container with the nav header and sidebar
 */
export function CTLayout(props) {
  let {
    role = "main",
    className,
    // styles
    defaultOpenSidebar = false,
    darkMode = false,
    transition = false,
    responsive = false,
    // children
    children,
    // child props
    headerProps = {},
    sidebarProps = {}
  } = props;

  let { float = false } = sidebarProps;

  const [openSidebar, setOpenSidebar] = useState(defaultOpenSidebar);
  const [floatSidebar, setFloatSidebar] = useState(float);
  const handleOpenSidebar = () => {
    setOpenSidebar(openSidebar_ => !openSidebar_);
  };

  const headerBrandElem = NavSidebarTrigger({
    darkMode,
    showSidebar: openSidebar,
    onSidebarTriggerClick: handleOpenSidebar,
  });

  const mainClasses = classNames(className);
  const contentClasses = classNames(
    'ct-layout-content', 
    { 
      transition,
      'padded-240': !float && openSidebar,
    }
  );

  return (
    <ScrollArea 
      role={role}
      scrollToTopButton="bottom right"
      id="ct-layout-main" 
      className={mainClasses}
    >
      <CTNavHeader
        sticky
        {...headerProps}
        darkMode={darkMode}
        brandElem={headerBrandElem}
      />

      <div className="ct-layout-page">
        <CTNavSidebar
          {...sidebarProps}
          darkMode={darkMode}
          show={openSidebar}
          float={floatSidebar}
          transition={transition}
          onClose={handleOpenSidebar}
        />

        <div className={contentClasses}>
          {children}
        </div>
      </div>
    </ScrollArea>
  );
}

CTLayout.propTypes = {
  /** Additional classes. */
  className: PropTypes.string,

  /** Role of the `CTLayout`, default to be `role="main"` */
  role: PropTypes.string,
  
  /** True if open the sidebar when the `CTLayout` rendered */
  defaultOpenSidebar: PropTypes.bool,

  /** The `CTLayout` supports the dark mode */
  darkMode: PropTypes.bool,

  /** True if smoothly show and hide sidebar */
  transition: PropTypes.bool,

  /** Sidebar can be responsive to the screen width */
  responsive: PropTypes.bool,
  
  /** Page content */
  children: PropTypes.node,
  
  /** Props to the nav header */
  headerProps: PropTypes.shape(CTNavHeaderPropsTypes),

  /** Props to the sidebar */
  sidebarProps: PropTypes.shape(CTNavSidebarPropTypes)
};