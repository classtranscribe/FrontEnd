import React, { useState, useEffect, useContext } from 'react';
import {
  CTFragment,
  CTFormHeading,
  CTFormRow,
  CTInput,
  CTSelect,
  CTCheckbox,
} from 'layout';
import { api, util, user } from 'utils';
import './index.scss';
import _ from 'lodash';
import { CourseContext } from './ContextProvider';

export function BasicInfo() {
  const courseContext = useContext(CourseContext)
  // user infomation
  const uniId = user.getUserInfo().universityId;
  // errors
  const emptyCourseName = courseContext.error.includes('courseName') && courseContext.enable;
  const emptySecName = courseContext.error.includes('sectionName') && courseContext.enable;
  // handle basic info from courseContext
  const setCourseName = ({ target: { value } }) => courseContext.setcourseName(value);
  const setSectionName = ({ target: { value } }) => courseContext.setsectionName(value);
  const handleTerm = ({ target: { value } }) => courseContext.setTerm(value);
  const [terms, setTerms] = useState([]);
  const onLogEventsFlagChange = ({ target: { checked } }) =>
    courseContext.setLogEventsFlag(checked);
  const onDescriptionChange = ({ target: { value } }) =>
    courseContext.setDescription(value);
  const handleVisibility = ({ target: { value } }) =>
    courseContext.selAccess(value);

  const getAccessTypes = (array = []) => {
    if (!Array.isArray(array)) return [];
    const options = [];
    array.forEach((item) => {
      if (!item || item.id === undefined) return;
      options.push({ text: item.name, value: item.id, description: item.description });
    });
    return options;
  };
  // Get terms list
  useEffect(() => {
    api.getTermsByUniId(uniId).then(res => {
      if (res.status === 200 && res.data) {
        setTerms(util.getSelectOptions(res.data, 'term'));
      }
    })
  }, [])
  return (
    <CTFragment>
      <CTFormHeading>Basic Information</CTFormHeading>
      <CTFormRow>
        <CTInput
          required
          id="course-name"
          error={emptyCourseName}
          label="Course Name"
          placeholder="Course Name"
          value={courseContext.courseName}
          onChange={setCourseName}
          helpText={emptyCourseName ? "Course Name is required." : ''}
        />
        <CTInput
          required
          id="section-name"
          error={emptySecName}
          label="Section Name"
          placeholder="Section Name"
          value={courseContext.sectionName}
          onChange={setSectionName}
          helpText={emptySecName ? "Section Name is required." : ''}
        />
      </CTFormRow>
      <CTFormRow>
        <CTSelect
          required
          error={false}
          id="sel-1"
          label="Select a Term"
          options={terms}
          value={courseContext.term}
          onChange={handleTerm}
        />
        <CTSelect
          required
          id="sel-1"
          label="Visibility"
          helpText="Choose the user group of this course."
          defaultValue="0"
          options={getAccessTypes(api.offeringAccessType)}
          value={courseContext.accessType}
          onChange={handleVisibility}
        />
      </CTFormRow>
      <CTFormRow>
        <CTInput
          textarea
          id="course-description"
          helpText="The description for this class"
          label="Course description"
          value={courseContext.description}
          onChange={onDescriptionChange}
        />
      </CTFormRow>
      <CTFormRow padding={[0, 10]}>
        <CTCheckbox
          id="log-event"
          helpText="Turn it on if you would like to receive the statistics of students' perfermance in the future."
          label="Log student events"
          checked={courseContext.logEventsFlag}
          onChange={onLogEventsFlagChange}
        />
      </CTFormRow>
    </CTFragment>
  );
}