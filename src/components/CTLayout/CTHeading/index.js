import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.scss';

export function CTHeading(props) {
  let {
    heading = 'Heading',
    icon,
    sticky = false,
    fade = true,
    gradient = true,
    offsetTop = 0,
  } = props;

  const headingClasses = classNames(
    'ct-heading', 
    {
      sticky,
      gradient,
      'ct-a-fade-in': fade,
    }
  );

  const top = `${offsetTop }px`;

  return (
    <h1 className={headingClasses} style={{ top }}>
      {icon && <i className="material-icons">{icon}</i>}
      <span className="content">{heading}</span>
    </h1>
  );
}

CTHeading.propTypes = {
  /** The Content of the heading */
  heading: PropTypes.string,

  /** Icon name of the material-icons */
  icon: PropTypes.string,

  /** The heading can be sticky */
  sticky: PropTypes.bool,

  /** The heading can fade in */
  fade: PropTypes.bool,

  /** The background of the heading can be gradient */
  gradient: PropTypes.bool,

  /** Set the offset top of the sticky heading */
  offsetTop: PropTypes.number,
};
