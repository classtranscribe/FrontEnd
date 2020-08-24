import React from 'react';
import { InfoAndListLayout } from 'components';
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
    <InfoAndListLayout.Info id="cp-course-info">
      <div>
        <h1 className="number">{fullNumber}</h1>
      </div>
      <div className="name">{courseName}</div>
      <div className="term">{termName} | {sectionName}</div>

      <ActionButtons 
        show={user.isLoggedIn}
        isInsructor={setup.isInstructor(role)} 
        isInstMode={isInstMode}
        offering={offering}
        starredOfferings={starredOfferings}
      />

      {description && <div className="description">{description}</div>}
    </InfoAndListLayout.Info>
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


