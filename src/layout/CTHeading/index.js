import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.scss';

import { CTFragment } from '../CTFragment';

export function CTHeading(props) {
  let {
    heading = 'Heading',
    icon,
    sticky = false,
    gradient = true,
    offsetTop = 0,
  } = props;

  const top = `${offsetTop }px`;

  const fragmentProps = {
    fade: true,
    sticky,
    padding: [30, 30, 20, 30],
    offsetTop,
    className: classNames('ct-heading-con', { gradient })
  };

  return (
    <CTFragment {...fragmentProps}>
      <h1 className="ct-heading" style={{ top }}>
        {icon && <i className="material-icons">{icon}</i>}
        <span className="content">{heading}</span>
      </h1>
    </CTFragment>
  );
}

CTHeading.propTypes = {
  /** The Content of the heading */
  heading: PropTypes.string,

  /** Icon name of the material-icons */
  icon: PropTypes.string,

  /** The heading can be sticky */
  sticky: PropTypes.bool,

  /** The background of the heading can be gradient */
  gradient: PropTypes.bool,

  /** Set the offset top of the sticky heading */
  offsetTop: PropTypes.number,
};
