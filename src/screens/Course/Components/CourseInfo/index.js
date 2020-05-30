import React, { useEffect } from 'react';
import { CTFragment } from 'components';
import { connectWithRedux, setup } from '../../controllers';
import './index.scss';

function CourseInfoWithRedux({
  offering,
}) {
  let {
    fullNumber,
    courseName,
    termName,
    sectionName,
    description
  } = offering;

  // useEffect(() => {
  //   return setup.clear;
  // }, [])

  return (
    <CTFragment list id="cp-course-info">
      <h1 className="number">{fullNumber}</h1>
      <div className="name">{courseName}</div>
      <div className="term">{termName} | {sectionName}</div>
      
      {description && <div className="description">{description}</div>}
    </CTFragment>
  );
}

export const CourseInfo = connectWithRedux(
  CourseInfoWithRedux,
  ['offering']
);


