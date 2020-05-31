import React from 'react';
import { CTFragment } from 'layout';
import { CourseCardList } from 'components';
import { CTHeading } from 'layout/CTHeading';
import './index.scss';

export function CourseList({
  title,
  offerings = []
}) {
  return offerings.length > 0 ? (
    <CTFragment className="mc-c-ul-con">
      <CTHeading heading={title} as="h4" padding={[10, 40]} />

      <CourseCardList padding={[0, 30]} courses={offerings} />
    </CTFragment>
  ) : null;
}
