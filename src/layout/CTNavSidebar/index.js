import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

import { SignInPrompt } from 'components/SignInPrompt';
import { SidebarItem, SidebarItemPropTypes } from './SidebarItem';
import { SidebarNavItems } from './SidebarNavItems';
import { altEl } from '../tools';

function CTNavSidebar(props) {
  let {
    show = true,
    items = [],
    brandElem,
    children,
    mini = false,
    float = false,
    darkMode = false,
    onClose,
  } = props;

  const sidebarClasses = classNames({ show, mini, float });
  const drawerClasses = classNames({ show, 'ct-nav-dark': darkMode });
  const signinPromptElement = altEl(SignInPrompt, !mini || float);

  return (
    <div id="ct-nav-sidebar" className={sidebarClasses}>
      <div className="ct-nsb-wrapper" onClick={onClose} />
      <div id="ct-nsb-drawer" className={drawerClasses}>
        <div id="ct-nsb-con">
          {brandElem}

          {
            items.length > 0 
            ? 
              <SidebarNavItems darkMode={darkMode} mini={mini} items={items} />
            :
            children
          }

          {signinPromptElement}
        </div>
      </div>
    </div>
  );
}

export const CTNavSidebarPropTypes = {
  /** True if show the sidebar */
  show: PropTypes.bool,

  /** Nav list items on sidebar */
  items: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape(SidebarItemPropTypes),
    PropTypes.string
  ])),

  /** The sidebar can have a brand element */
  brandElem: PropTypes.node,

  /** Primary content */
  children: PropTypes.node,

  /** The sidebar supports a mini view */
  mini: PropTypes.bool,
  
  /** True if display the floating sidebar */
  float: PropTypes.bool,

  /** The sidebar supports dark mode */
  darkMode: PropTypes.bool,

  /** Handle close the sidebar */
  onClose: PropTypes.func
};

CTNavSidebar.propTypes = CTNavSidebarPropTypes;

// Sub components
CTNavSidebar.Items = SidebarNavItems;
CTNavSidebar.Item = SidebarItem;

export default CTNavSidebar;