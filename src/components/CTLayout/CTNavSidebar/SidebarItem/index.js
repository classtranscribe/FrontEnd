import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import './index.scss';

import { SidebarSubItem, SidebarSubItemPropTypes } from './SidebarSubItem';

/**
 * The general nav list item of sidebar
 */
export function SidebarItem(props) {
  let {
    darkMode,
    breakline,
    text,
    href,
    icon,
    onClick,
    active = false,
    activeType = 'exact', // 'exact', 'default'
    mini = false,
    items = [],
    reloadOnPathnameChange = false,
  } = props;

  if (breakline) return <hr />;

  const hasItems = items.length > 0;

  if (activeType === 'starts') {
    active = window.location.pathname.startsWith(href);
  } else if (activeType === 'exact') {
    active = window.location.pathname === href;
  }

  if (hasItems && items[0].href) {
    href = items[0].href;
  }

  const itemActionElem = typeof onClick === 'function' ? (
    <button className="ct-nsb-li-content" onClick={onClick}>
      <i className="material-icons">{icon}</i>
      <span>{text}</span>
    </button>
  ) : reloadOnPathnameChange ? (
    <a className="ct-nsb-li-content" href={href}>
      <i className="material-icons">{icon}</i>
      <span>{text}</span>
    </a>
  ) : (
    <Link className="ct-nsb-li-content" to={href}>
      <i className="material-icons">{icon}</i>
      <span>{text}</span>
    </Link>
  );

  const itemClasses = classNames('ct-nsb-li', {
    active,
    'ct-nav-dark': darkMode
  });

  return (
    <div role="listitem" className={itemClasses}>
      {itemActionElem}

      {
        (active && hasItems && !mini)
        &&
        <div className="ct-nsb-ul-sub">
          {items.map(item => <SidebarSubItem {...item} />)}
        </div>
      }
    </div>
  );
}

export const SidebarItemPropTypes = {
  /** The sidebar item supports dark mode */
  darkMode: PropTypes.bool,

  /** The item can represent a `<hr />` */
  breakline: PropTypes.bool,

  /** Text content of the sub-item */
  text: PropTypes.string,

  /** Node content of the sub-item */
  children: PropTypes.node,

  /** Icon for the item */
  icon: PropTypes.string,

  /** Sub-item as a link */
  href: PropTypes.string,

  /** True if reload the page when access */
  reloadOnPathnameChange: PropTypes.bool,

  /** Sub-item as a button */
  onClick: PropTypes.func,

  /** True if the tab is active */
  active: PropTypes.bool,

  /** Methods to deterine if the tab is active */
  activeType: PropTypes.oneOf(['starts', 'exact', 'default']),

  /** The sidebar supports a mini view */
  mini: PropTypes.bool,

  /** Sub-items of this tab */
  items: PropTypes.arrayOf(PropTypes.shape(SidebarSubItemPropTypes)),
};

SidebarItem.propTypes = SidebarItemPropTypes;
