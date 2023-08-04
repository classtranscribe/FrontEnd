import React, { useCallback } from 'react';
import { CourseForm } from 'screens/Instructor/NewCourse/components';
import { connect } from 'react-redux';
import { prompt, api, links } from 'utils';
import _ from 'lodash';

export function CourseInfoWithRedux(props) {
  const { dispatch, course } = props;
  const {
    offering
  } = course
  const {
    courses = [],
    termId,
    sectionName,
    courseName,
    accessType,
    description,
    logEventsFlag,
  } = offering
  const selCourses = courses.map(course_ => ({ ...course_, id: course_.courseId }));
  async function updateCourseOfferings(newOffering) {
    const oldOffering = offering;
    const offeringId = offering.id;
    let newCourses = newOffering.courseIds;
    let oldCourses = _.map(oldOffering.courses, course_ => course_.courseId);
  
    let added = _.difference(newCourses, oldCourses);
    let removed = _.difference(oldCourses, newCourses);
    
    // link added courses to this offering
    if (added.length > 0) {
      await Promise
      .all(added.map((courseId) => new Promise((resolve) => {
        api.createCourseOffering({ courseId, offeringId })
          .then(() => resolve());
      })))
      .catch((error) => {
        console.error(error);
        prompt.error('Failed to remove course.');
      });
    }
  
    if (removed.length > 0) {
      await Promise
      .all(removed.map((courseId) => new Promise((resolve) => {
        api.deleteCourseOffering(courseId, offeringId)
          .then(() => resolve());
      })))
      .catch((error) => {
        console.error(error);
        prompt.error('Failed to add course.');
      });
    }
  }
  
   const updateCourseInfo = useCallback(async function updateCourseInfo(newOffering) {
    const oldOffering = offering;
    const updatedOff = {
      id: oldOffering.id,
      sectionName: newOffering.sectionName,
      termId: newOffering.termId,
      accessType: newOffering.accessType,
      logEventsFlag: newOffering.logEventsFlag,
      courseName: newOffering.courseName,
      description: newOffering.description,
    };
    /// update Model
    try {
      await api.updateOffering(updatedOff);
    } catch (error) {
      console.error(error);
      prompt.error('Failed to update the course info.');
      return;
    }

    // handle linked course templates ?
    await updateCourseOfferings(newOffering);
    
    dispatch({type: 'course/setOffering', payload: {...oldOffering, ...updatedOff}}); // update course info
    prompt.addOne({ text: 'Course information updated.', timeout: 3000 });
  });
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
      onSave={updateCourseInfo}
      saveButtonText="save changes"
    />
  );
}

export const CourseInfo = connect(({ course, loading }) => ({
  course
}))(CourseInfoWithRedux);