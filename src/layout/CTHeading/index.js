import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import CTFragment from '../CTFragment';
import './index.scss';

import { createCTHeadingProps } from './create-props';

/**
 * The controlled heading component
 */
function CTHeading(props) {
  let {
    as = 'h1',
    className,
    heading = 'Heading',
    icon,
    fadeIn = true,
    sticky = false,
    gradient = false,
    offsetTop = 0,
    uppercase = false,
    highlight = false,
    highlightIcon = false,
    children,
    compact,
    ...otherProps
  } = props;

  const headingElement = children || heading;

  const headingClasses = classNames('ct-heading', {
    uppercase,
    gradient,
    highlight,
    highlightIcon,
  }, className);

  if (compact) {
    otherProps.margin = '0';
    otherProps.padding = '0';
  }

  const fragmentProps = {
    as,
    fadeIn,
    sticky,
    offsetTop,
    alignItCenter: true,
    className: headingClasses,
    ...otherProps
  };

  const iconElement = typeof icon === 'string'
    ? <i className="material-icons">{icon}</i>
    : icon;

  return (
    <CTFragment {...fragmentProps}>
      {iconElement}

      <span className="content">{headingElement}</span>
    </CTFragment>
  );
}

CTHeading.propTypes = {
  ...CTFragment.propTypes,

  /** The heading supports `'h1', 'h2', 'h3', 'h4', 'h5'` */
  as: PropTypes.elementType,

  /** The Content of the heading */
  heading: PropTypes.string,

  /** Icon name of the material-icons */
  icon: PropTypes.node,

  /** The heading can be faded in */
  fade: PropTypes.bool,

  /** The heading can be sticky */
  sticky: PropTypes.bool,

  /** The background of the heading can be gradient */
  gradient: PropTypes.bool,

  /** Set the offset top of the sticky heading */
  offsetTop: PropTypes.number,

  /** The heading can be uppercase */
  uppercase: PropTypes.bool,

  /** The heading can be highlighted to teal color */
  highlight: PropTypes.bool,

  /** The icon can be highlighted to teal color */
  highlightIcon: PropTypes.bool,

  /** Remove the default paddings and margins */
  compact: PropTypes.bool,

  /** The Content of the heading */
  children: PropTypes.node,
};

CTHeading.createProps = createCTHeadingProps;

export default CTHeading;