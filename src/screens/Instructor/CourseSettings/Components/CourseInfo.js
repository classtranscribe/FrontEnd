import React from 'react';
import { CourseForm } from 'screens/Instructor/NewCourse/Components';
import { connectWithRedux, offControl } from '../controllers';

export function CourseInfoWithRedux({
  offering
}) {
  const {
    courses = [],
    termId,
    sectionName,
    courseName,
    accessType,
    description,
    logEventsFlag,
  } = offering || {};

  return (
    <CourseForm
      collapsible
      defaultSelCourses={courses}
      defaultCourseName={courseName}
      defaultSectionName={sectionName}
      defaultTerm={termId}
      defaultAccessType={accessType}
      defaultDescription={description}
      defaultLogFlag={logEventsFlag}
      onSave={offControl.updateCourseInfo}
      saveButtonText="save changes"
    />
  );
}

export const CourseInfo = connectWithRedux(
  CourseInfoWithRedux,
  ['offering']
);
