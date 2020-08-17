import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CTFragment } from 'layout';
import CourseCard from './Card';

function CourseCardList(props) {
  let {
    row = false,
    className,
    padding,
    courses = [],
  } = props;

  const listClasses = classNames('ct-course-card-ul', className, { row });
  const listProps = {
    padding,
    role: 'list',
    className: listClasses
  };

  const cardProps = { row, fluid: row };

  return (
    <CTFragment {...listProps}>
      {courses.map(course => (
        <CourseCard key={course.id} {...cardProps} {...CourseCard.parse(course)} />
      ))}
    </CTFragment>
  )
}

CourseCardList.propTypes = {
  /** The list can be a row */
  row: PropTypes.bool,
  /** courses of the list */
  courses: PropTypes.arrayOf(PropTypes.shape())
};

export default CourseCardList;
