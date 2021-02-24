import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from 'dva/router';
import { CTFragment, CTText } from 'layout';
import './index.scss';

import { parseCourse } from './parse-course';

function CourseCard(props) {
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

  const cardProps = {
    id,
    as: Link,
    to: href,
    className: cardClasses,
    title: `${number} | ${name} | ${term} | ${section}`
  };

  if (listitem) cardProps.role = 'listitem';

  return (
    <CTFragment {...cardProps}>
      <div className="title">
        <CTText teal bold className="number" size="large" line={1}>
          {number}
        </CTText>

        <CTText bold size="big" line={2}>{name}</CTText>
      </div>

      <CTText celadon size="medium" line={1}>
        {term} | {section}
      </CTText>

      <CTText fluid muted line={2} margin={[3, 0, 0, 0]}>{description}</CTText>
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

export default CourseCard;