import React from 'react';
import { CTFragment } from 'layout';
import { user } from 'utils';
import { connectWithRedux, setup } from '../../controllers';
import ActionButtons from './ActionButtons';
import './index.scss';

function CourseInfoWithRedux({
  role,
  isInstMode,
  offering,
  starredOfferings,
}) {
  const {
    fullNumber,
    courseName,
    termName,
    sectionName,
    description
  } = offering;
  
  return (
    <CTFragment list id="cp-course-info">
      <h1 className="number">{fullNumber}</h1>
      <div className="name">{courseName}</div>
      <div className="term">{termName} | {sectionName}</div>

      <ActionButtons 
        show={user.isLoggedIn}
        isInsructor={setup.isInstructor(role)} 
        isInstMode={isInstMode}
        offeringId={offering.id}
        starredOfferings={starredOfferings}
      />

      {description && <div className="description">{description}</div>}
    </CTFragment>
  );
}

export const CourseInfo = connectWithRedux(
  CourseInfoWithRedux,
  [
    'offering', 
    'starredOfferings', 
    'role',
    'isInstMode'
  ]
);


