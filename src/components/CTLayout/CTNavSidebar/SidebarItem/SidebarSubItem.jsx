import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

export function SidebarSubItem(props) {
  let {
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
    <div role="listitem" className={itemClasses}>
      {itemActionElem}
    </div>
  );
}

export const SidebarSubItemPropTypes = {
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
