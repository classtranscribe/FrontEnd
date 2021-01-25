import React from 'react';
import { connect } from 'dva';
import { InfoAndListLayout } from 'components';
import ActionButtons from './ActionButtons';
import './index.scss';
import courseutil from '../../util'

function CourseInfoWithRedux(props) {
  const { course, dispatch } = props;
  const {
    role,
    isInstMode,
    offering = {},
    starredOfferings,
  } = course;
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
        isInsructor={courseutil.isInstructor(role)}
        isInstMode={isInstMode}
        offering={offering}
        starredOfferings={starredOfferings}
        dispatch={dispatch}
      />

      {description && <div className="description">{description}</div>}
    </InfoAndListLayout.Info>
  );
}

export const CourseInfo = connect(({ course, loading }) => ({
  course
}))(CourseInfoWithRedux);


