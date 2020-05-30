import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.scss';

import { CTFragment } from '../CTFragment';

import { createCTHeadingProps } from './create-props';

/**
 * The controlled heading component
 */
export function CTHeading(props) {
  let {
    as = 'h1',
    heading = 'Heading',
    icon,
    sticky = false,
    gradient = true,
    offsetTop = 0,
    highlight = false,
    highlightIcon = false,
  } = props;

  const headingClasses = classNames('ct-heading', { 
    gradient,
    highlight,
    highlightIcon,
  });

  const fragmentProps = CTFragment.createProps({
    as,
    fade: true,
    sticky,
    padding: [30, 30, 20, 30],
    offsetTop,
    vCenter: true,
    className: headingClasses
  });

  return (
    <CTFragment {...fragmentProps}>
      {icon && <i className="material-icons">{icon}</i>}
      <span className="content">{heading}</span>
    </CTFragment>
  );
}

CTHeading.propTypes = {
  /** The heading supports `'h1', 'h2', 'h3', 'h4', 'h5'` */
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5']),

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

  /** The heading can be highlighted to teal color */
  highlight: PropTypes.bool,

  /** The icon can be highlighted to teal color */
  highlightIcon: PropTypes.bool,
};

CTHeading.createProps = createCTHeadingProps;
