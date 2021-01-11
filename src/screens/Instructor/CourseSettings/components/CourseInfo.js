import React from 'react';
import { CourseForm } from 'screens/Instructor/NewCourse/components';
import { connect } from 'dva';
const offControl = {};
export function CourseInfoWithRedux(props) {
  const {
    offering
  } = props.course
  const {
    courses = [],
    termId,
    sectionName,
    courseName,
    accessType,
    description,
    logEventsFlag,
  } = offering
  const selCourses = courses.map(course => ({ ...course, id: course.courseId }));

  return (
    <CourseForm
      collapsible
      defaultSelCourses={selCourses}
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

export const CourseInfo = connect(({ course, loading }) => ({
  course
}))(CourseInfoWithRedux);