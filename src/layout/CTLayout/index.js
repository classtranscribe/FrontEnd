import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CTScrollArea from '../CTScrollArea';
import CTNavHeader from '../CTNavHeader';
import CTNavSidebar from '../CTNavSidebar';
import CTHeading from '../CTHeading';
import CTFooter from '../CTFooter';
import NavSidebarTrigger from './NavSidebarTrigger';
import './index.scss';

import { createCTLayoutProps } from './create-props';
import {
  getDefaultSidebarType,
  getScreenResizeListener,
  handleOpenResponsiveSidebar
} from './responsive';

/**
 * A general page container with the nav header and sidebar
 */
function CTLayout(props) {
  let {
    role = "main",
    className,
    // styles
    fill = false,
    darkMode = false,
    logoBrand = false,
    transition = false,
    responsive = false,
    defaultOpenSidebar = false,
    footer = false,
    // children
    children,
    // child props
    headerProps = {},
    sidebarProps = {},
    headingProps,
  } = props;

  let { float = false, mini = false } = sidebarProps;

  let defaultSidebar = getDefaultSidebarType(responsive, defaultOpenSidebar, { float, mini });
  const [sidebar, setSidebar] = useState(defaultSidebar);

  useEffect(() => {
    if (responsive) {
      const { 
        addScreenResizeListener, 
        removeScreenResizeListener 
      } = getScreenResizeListener(defaultSidebar, setSidebar);
      
      addScreenResizeListener();

      return removeScreenResizeListener;
    }
  }, []);

  const isOpen = Boolean(sidebar);
  const isClose = !isOpen;
  const isNormal = isOpen && sidebar.includes('normal');
  const isMini = isOpen && sidebar.includes('mini');
  const isFloat = isOpen && sidebar.includes('float');

  const handleOpenSidebar = () => {
    if (responsive) {
      handleOpenResponsiveSidebar(setSidebar);
    } else if (isMini) {
        setSidebar('normal');
      } else if (isNormal) {
        setSidebar('mini');
      } else if (isFloat) {
        setSidebar(null);
      } else if (isClose) {
        setSidebar(float ? 'float' : mini ? 'mini' : 'normal');
      }
  };

  // Classes
  const containerClasses = classNames(className);
  const mainClasses = classNames(
    'ct-layout-main', 
    { 
      fill,
      transition,
      'padded-240': isNormal,
      'padded-50': isMini,
    }
  );

  // Brand Element
  const brandElemProps = {
    darkMode,
    showSidebar: isOpen,
    onSidebarTriggerClick: handleOpenSidebar,
  };
  const sidebarBrandElem = <NavSidebarTrigger {...brandElemProps} />;

  brandElemProps.withTrigger = !isMini;
  brandElemProps.logo = logoBrand;
  const headerBrandElem = isNormal 
                        ? <div /> 
                        : <NavSidebarTrigger {...brandElemProps} />;

  const headingElement = headingProps
                        ? <CTHeading {...headingProps} highlightIcon />
                        : null;
  // Page Element
  const pageElement = fill 
                    ? <div className="ct-layout-fill">{children}</div>
                    : children;
  
  const footerElement = footer ? <CTFooter /> : null;

  return (
    <div id="ct-layout-container" className={containerClasses}>
      <CTNavSidebar
        {...sidebarProps}
        darkMode={darkMode}
        show={isOpen}
        float={isFloat}
        mini={isMini}
        transition={transition}
        brandElem={sidebarBrandElem}
        onClose={handleOpenSidebar}
      />

      <CTScrollArea 
        role={role}
        scrollToTopButton="bottom right"
        scrollClassName={mainClasses}
        disabled={fill}
      >
        <CTNavHeader
          {...headerProps}
          sticky
          darkMode={darkMode}
          brandElem={headerBrandElem}
        />

        {headingElement}
        {pageElement}
        {footerElement}

      </CTScrollArea>
    </div>
  );
}

export const CTLayoutPropTypes = {
  /** Additional classes. */
  className: PropTypes.string,

  /** Role of the `CTLayout`, default to be `role="main"` */
  role: PropTypes.string,

  /** True if fill the whole page */
  fill: PropTypes.bool,

  /** The `CTLayout` supports the dark mode */
  darkMode: PropTypes.bool,

  /** Determine display the logo brand or text-brand, default: `false` */
  logoBrand: PropTypes.bool,

  /** True if smoothly show and hide sidebar */
  transition: PropTypes.bool,

  /** Sidebar can be responsive to the screen width */
  responsive: PropTypes.bool,

  /** True if open the sidebar when the `CTLayout` rendered */
  defaultOpenSidebar: PropTypes.bool,

  /** The page content can have a default footer */
  footer: PropTypes.bool,
  
  /** Page content */
  children: PropTypes.node,
  
  /** Props to the nav header */
  headerProps: PropTypes.shape(CTNavHeader.propTypes),

  /** Props to the sidebar */
  sidebarProps: PropTypes.shape(CTNavSidebar.propTypes),

  /** Props to the heading */
  headingProps: PropTypes.shape(CTHeading.propTypes)
};

CTLayout.propTypes = CTLayoutPropTypes;
CTLayout.createProps = createCTLayoutProps;

export default CTLayout;