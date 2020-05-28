import React from 'react';
import PropTypes from 'prop-types';
import { SidebarItem, SidebarItemPropTypes } from './SidebarItem';

export function SidebarNavItems(props) {
  let {
    darkMode = false,
    mini,
    items
  } = props;

  return (
    <div className="ct-nsb-ul">
      {items.map( item => (
        <SidebarItem 
          mini={mini}
          darkMode={darkMode} 
          breakline={item === 'breakline'} 
          {...item}
        />
      ))}
    </div>
  );
}

SidebarNavItems.propTypes = {
  /** Sidebar supports dark mode */
  darkMode: PropTypes.bool,

  /** The sidebar supports a mini view */
  mini: PropTypes.bool,

  /** Nav items */
  items: PropTypes.arrayOf(SidebarItemPropTypes)
};
