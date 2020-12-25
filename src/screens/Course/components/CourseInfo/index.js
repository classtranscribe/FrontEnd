import React from 'react';
import { InfoAndListLayout } from 'components';
import { CTFragment } from 'layout';
import { connectWithRedux, setup } from '../../controllers';
import { NavHeaderSearch } from '../NavHeaderSearch';
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
      <CTFragment className="cp-search-bar mb-3">
        <NavHeaderSearch />
      </CTFragment>

      <div>
        <h1 className="number">{fullNumber}</h1>
      </div>
      <div className="name">{courseName}</div>
      <div className="term">{termName} | {sectionName}</div>

      <ActionButtons 
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


