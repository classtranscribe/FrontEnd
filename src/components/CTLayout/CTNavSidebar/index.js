import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

import { SidebarItem, SidebarItemPropTypes } from './SidebarItem';
import { SidebarNavItems } from './SidebarNavItems';
import { getDefaultNSBItems } from './default-sidebar-props';

export function CTNavSidebar(props) {
  let {
    show = true,
    // children
    items = [],
    children,
    // styles
    float = false,
    darkMode = false,
  } = props;

  if (!items || items.length === 0) {
    items = getDefaultNSBItems();
  }

  const sidebarClasses = classNames({ float, show });
  const drawerClasses = classNames({ show, 'ct-nav-dark': darkMode });

  return (
    <div id="ct-nav-sidebar" className={sidebarClasses}>
      <div className="ct-nsb-wrapper" />

      <div id="ct-nsb-drawer" className={drawerClasses}>
        <div id="ct-nsb-con">
          {
            items.length > 0 
            ? 
              <SidebarNavItems items={items} />
            :
            children
          }
        </div>
      </div>
    </div>
  );
}

export const CTNavSidebarPropTypes = {
  /** True if show the sidebar */
  show: PropTypes.bool,

  /** Nav list items on sidebar */
  items: PropTypes.arrayOf(PropTypes.shape(SidebarItemPropTypes)),

  /** Primary content */
  children: PropTypes.node,
  
  /** True if display the floating sidebar */
  float: PropTypes.bool,

  /** The sidebar supports dark mode */
  darkMode: PropTypes.bool,
};

CTNavSidebar.propTypes = CTNavSidebarPropTypes;

// Sub components
CTNavSidebar.Items = SidebarNavItems;
CTNavSidebar.Item = SidebarItem;