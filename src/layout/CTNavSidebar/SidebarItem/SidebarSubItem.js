import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'dva/router';

export function SidebarSubItem(props) {
  let {
    value,
    text,
    children,
    href,
    onClick,
    active = false,
  } = props;

  active = active || window.location.pathname.startsWith(href);
  children = children || text;

  const itemActionElem = typeof onClick === 'function' ? (
    <button className="ct-nsb-li-sub-content" onClick={onClick}>
      <span>{children}</span>
    </button>
  ) : (
    <Link className="ct-nsb-li-sub-content" to={href}>
      <span>{children}</span>
    </Link>
  );

  const itemClasses = classNames('ct-nsb-li-sub', { active });

  return (
    <div id={value} role="listitem" className={itemClasses}>
      {itemActionElem}
    </div>
  );
}

export const SidebarSubItemPropTypes = {
  /** A unique value for each sidebar sub-item */
  value: PropTypes.string.isRequired,

  /** Text content of the sub-item */
  text: PropTypes.string.isRequired,

  /** Node content of the sub-item */
  children: PropTypes.node,

  /** Sub-item as a link */
  href: PropTypes.string,

  /** Sub-item as a button */
  onClick: PropTypes.func,

  /** True if the tab is active */
  active: PropTypes.bool,
}
