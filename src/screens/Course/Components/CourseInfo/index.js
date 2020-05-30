import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment } from 'components';
import { user } from 'utils';
import { connectWithRedux, setup } from '../../controllers';
import './index.scss';

function CourseInfoWithRedux({
  offering,
  starredOfferings,
}) {
  let {
    fullNumber,
    courseName,
    termName,
    sectionName,
    description
  } = offering;

  const isStarred = Boolean(starredOfferings[offering.id]);
  
  return (
    <CTFragment list id="cp-course-info">
      <h1 className="number">{fullNumber}</h1>
      <div className="name">{courseName}</div>
      <div className="term">{termName} | {sectionName}</div>

      {
        user.isLoggedIn
        &&
        <CTFragment padding={[20, 0, 0, 0]}>
          <Button
            uppercase
            outlined={isStarred}
            icon={isStarred ? 'star' : 'star_border'}
            color={isStarred ? 'primary' : 'teal'}
            onClick={isStarred ? setup.unstar : setup.star}
          >
            {isStarred ? 'unstar' : 'star'}
          </Button>
        </CTFragment>
      }

      {description && <div className="description">{description}</div>}
    </CTFragment>
  );
}

export const CourseInfo = connectWithRedux(
  CourseInfoWithRedux,
  ['offering', 'starredOfferings']
);


