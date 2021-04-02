import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'dva/router';
import './index.scss';

import { SidebarSubItem, SidebarSubItemPropTypes } from './SidebarSubItem';

/**
 * The general nav list item of sidebar
 */
export function SidebarItem(props) {
  let {
    value,
    darkMode,
    breakline,
    text,
    href,
    icon,
    onClick,
    active = false,
    mini = false,
    items = [],
    reloadOnPathnameChange = false,
  } = props;

  if (breakline) return <hr />;

  const hasItems = items.length > 0;

  if (hasItems && !href && items[0].href) {
    href = items[0].href;
  }

  const itemContentElem = (
    <>
      <i aria-hidden="true" className="material-icons">{icon}</i>
      <span>{text}</span>
    </>
  );

  const itemActionElem = typeof onClick === 'function' ? (
    <button className="ct-nsb-li-content" onClick={onClick}>
      {itemContentElem}
    </button>
  ) : reloadOnPathnameChange || value.includes("extLinks")? (
    <a className="ct-nsb-li-content" href={href}>
      {itemContentElem}
    </a>
  ) : (
    <Link className="ct-nsb-li-content" to={{pathname: href, search: '', hash: '' }}>
      {itemContentElem}
    </Link>
  );

  const itemClasses = classNames('ct-nsb-li', {
    active,
    'ct-nav-dark': darkMode
  });

  return (
    <div id={value} role="listitem" className={itemClasses}>
      {itemActionElem}

      {
        (active && hasItems && !mini)
        &&
        <div className="ct-nsb-ul-sub" role="list">
          {items.map(item => <SidebarSubItem key={item.value} {...item} />)}
        </div>
      }
    </div>
  );
}

export const SidebarItemPropTypes = {
  /** A unique value for each sidebar item */
  value: PropTypes.string,

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

  /** The sidebar supports a mini view */
  mini: PropTypes.bool,

  /** Sub-items of this tab */
  items: PropTypes.arrayOf(PropTypes.shape(SidebarSubItemPropTypes)),
};

SidebarItem.propTypes = SidebarItemPropTypes;
