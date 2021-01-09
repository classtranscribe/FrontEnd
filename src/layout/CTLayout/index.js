import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';
import CTCookieAgreement from 'components/CTCookieAgreement'
import { altEl, makeEl } from '../tools';
import CTScrollArea from '../CTScrollArea';
import CTNavHeader from '../CTNavHeader';
import CTNavSidebar from '../CTNavSidebar';
import CTHeading from '../CTHeading';
import CTFooter from '../CTFooter';
import CTMetaTags from '../CTMetaTags';
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
    metaTagsProps = {},
    cookieAgreementModal = true
  } = props;

  const { float = false, mini = false } = sidebarProps;
  const { tabs } = headerProps;

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
  const containerClasses = cx(className);
  const mainClasses = cx(
    'ct-layout-main',
    {
      fill,
      'tab-header': Array.isArray(tabs) && tabs.length > 0,
      transition,
      'padded-240': isNormal,
      'padded-50': isMini,
      mobile: isMobile
    }
  );

  // Brand Element
  const brandElemProps = {
    darkMode,
    linkDisabled: !isNormal,
    showSidebar: isOpen,
    onSidebarTriggerClick: handleOpenSidebar,
  };
  const sidebarBrandElem = makeEl(NavSidebarTrigger, brandElemProps);

  brandElemProps.withTrigger = !isMini;
  brandElemProps.logo = logoBrand;
  brandElemProps.linkDisabled = false;
  const headerBrandElem = altEl(NavSidebarTrigger, !isNormal, brandElemProps, <div />);

  const headingElement = altEl(CTHeading, Boolean(headingProps), {
    gradient: true,
    highlightIcon: true,
    ...headingProps
  });

  // Page Element
  const pageElement = altEl(
    children, !fill, null, <div className="ct-layout-fill">{children}</div>);

  const footerElement = altEl(CTFooter, footer);
  const cookieAgreementElement = altEl(CTCookieAgreement, cookieAgreementModal);

  return (
    <div id="ct-layout-container" className={containerClasses}>
      <CTMetaTags {...metaTagsProps} />

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
        id="ct-layout-scroll"
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

        {cookieAgreementElement}
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
  headingProps: PropTypes.shape(CTHeading.propTypes),

  /** Meta tags */
  metaTagsProps: PropTypes.shape(CTMetaTags.propTypes)
};

CTLayout.propTypes = CTLayoutPropTypes;
CTLayout.createProps = createCTLayoutProps;

export default CTLayout;