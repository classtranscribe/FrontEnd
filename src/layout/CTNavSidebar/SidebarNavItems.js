import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid} from 'uuid'
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
          key={item.value || `breakline-${uuid()}`}
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
  items: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(SidebarItemPropTypes)
  ]))
};
