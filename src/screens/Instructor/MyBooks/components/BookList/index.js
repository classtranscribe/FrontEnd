import React from 'react';
import { CTFragment , CTHeading } from 'layout';
import { CourseCardList } from 'components';

import './index.scss';

export function CourseList({
  title,
  offerings = []
}) {
  return offerings.length > 0 ? (
    <CTFragment className="mc-c-ul-con">
      <CTHeading heading={title} as="h4" padding={[10, 10]} />

      <CourseCardList courses={offerings} />
    </CTFragment>
  ) : null;
}
