import React from 'react';
import PropTypes from 'prop-types';
import { SidebarItem, SidebarItemPropTypes } from './SidebarItem';

export function SidebarNavItems(props) {
  let {
    items
  } = props;

  return (
    <div className="ct-nsb-ul">
      {items.map( item => (
        <SidebarItem breakline={item === 'breakline'} {...item} />
      ))}
    </div>
  );
}

SidebarNavItems.propTypes = {
  items: PropTypes.arrayOf(SidebarItemPropTypes)
};
