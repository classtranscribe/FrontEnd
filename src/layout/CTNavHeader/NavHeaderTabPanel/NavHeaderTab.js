import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'dva/router';

export function NavHeaderTab(props) {
  let {
    text,
    active = false,
    href = false,
  } = props;

  const tabClasses = classNames('plain-btn ct-nh-tab', { active })

  return (
    <Link
      className={tabClasses}
      to={href}
    >
      <span tabIndex="-1">
        {text}
      </span>
    </Link>
  );
}

export const NavHeaderTabPropTypes = {
  /** The text content of the tab */
  text: PropTypes.string,

  /** True if it's the current tab */
  active: PropTypes.bool,

  /** The pathname of the tab */
  href: PropTypes.string
};

NavHeaderTab.propTypes = NavHeaderTabPropTypes;
