import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment } from 'layout';
import { user } from 'utils';
import { connectWithRedux, setup } from '../../controllers';
import './index.scss';

function CourseInfoWithRedux({
  role,
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
        <CTFragment vCenter padding={[20, 0, 0, 0]}>
          <Button.Group>
            {
              setup.isInstructor(role)
              &&
              <Button uppercase icon="settings">
                Settings
              </Button>
            }
            <Button
              uppercase
              outlined={isStarred}
              icon={isStarred ? 'star' : 'star_border'}
              color={isStarred ? 'teal' : 'teal'}
              onClick={isStarred ? setup.unstar : setup.star}
            >
              {isStarred ? 'unstar' : 'star'}
            </Button>
          </Button.Group>
        </CTFragment>
      }

      {description && <div className="description">{description}</div>}
    </CTFragment>
  );
}

export const CourseInfo = connectWithRedux(
  CourseInfoWithRedux,
  ['offering', 'starredOfferings', 'role']
);


