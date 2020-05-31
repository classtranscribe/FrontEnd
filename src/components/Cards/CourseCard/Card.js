import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { CTFragment } from 'layout';
import './index.scss';

import { parseCourse } from './parse-course';

export function CourseCard(props) {
  let {
    id,
    className,
    number,
    name,
    term,
    section,
    description,
    href,
    listitem = false,
    fluid = false,
    row,
  } = props;

  const cardClasses = cx('ct-course-card', className, { fluid, row });

  const cardProps = CTFragment.createProps({
    id,
    as: Link,
    to: href,
    className: cardClasses,
  });

  if (listitem) cardProps.role = 'listitem';

  return (
    <CTFragment {...cardProps}>
      <div className="title">
        <div className="number">
          {number}
        </div>

        <div className="name">{name}</div>
      </div>

      <div className="term">{term} | {section}</div>

      <div className="description">{description}</div>
    </CTFragment>
  );
}

CourseCard.propTypes = {
  /** An unique id to the course card */
  id: PropTypes.string,

  /** Additional classes */
  className: PropTypes.string,

  /** Course Number */
  number: PropTypes.string,

  /** Course Name */
  name: PropTypes.string,

  /** Term Name */
  term: PropTypes.string,

  /** Section Name */
  section: PropTypes.string,

  /** Description */
  description: PropTypes.string,

  /** Link */
  href: PropTypes.string,

  /** True if display the card as a listitem */
  listitem: PropTypes.bool,

  /** True if take the entire place */
  fluid: PropTypes.bool,

  /** True if display as a row in list */
  row: PropTypes.bool,
};

CourseCard.parse = parseCourse;

