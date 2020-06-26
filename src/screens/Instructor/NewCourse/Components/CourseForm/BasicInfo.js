import React, { useState, useEffect } from 'react';
import {
  CTFragment,
  CTFormHeading,
  CTFormRow,
  CTInput,
  CTSelect,
  CTCheckbox,
} from 'layout';
import { api, util } from 'utils';
import './index.scss';
import _ from 'lodash';

export function BasicInfo(props) {
  let {
    courseName,
    setcourseName,
    term,
    setTerm,
    logEventsFlag,
    setLogEventsFlag,
    description,
    setDescription,
    accessType,
    selAccess,
    error,
    enable,
    setsectionName,
    sectionName,
    uniId
  } = props;

  // errors
  const emptyCourseName = error.includes('courseName') && enable;
  const emptySecName = error.includes('sectionName') && enable;
  // handle basic info
  const setCourseName = ({ target: { value } }) => setcourseName(value);
  const setSectionName = ({ target: { value } }) => setsectionName(value);
  const handleTerm = ({ target: { value } }) => setTerm(value);
  const [terms, setTerms] = useState([]);
  const onLogEventsFlagChange = ({ target: { checked } }) =>
    setLogEventsFlag(checked);
  const onDescriptionChange = ({ target: { value } }) =>
    setDescription(value);
  const handleVisibility = ({ target: { value } }) =>
    selAccess(value);

  const getAccessTypes = (array = []) => {
    if (!Array.isArray(array)) return [];
    const options = [];
    array.forEach((item) => {
      if (!item || item.id === undefined) return;
      options.push({ text: item.name, value: item.id, description: item.description });
    });
    return options;
  };
  // reset values when university changed
  useEffect(() => {
    setLogEventsFlag(false)
    setsectionName('')
    setcourseName('')
    setDescription('')
  }, [uniId])
  // Get terms list
  useEffect(() => {
    api.getTermsByUniId(uniId).then(res => {
      if (res.status === 200 && res.data) {
        setTerms(util.getSelectOptions(res.data, 'term'));
      }
    })
  }, [uniId])
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
          value={courseName}
          onChange={setCourseName}
          helpText={emptyCourseName ? "Course Name is required." : ''}
        />
        <CTInput
          required
          id="section-name"
          error={emptySecName}
          label="Section Name"
          placeholder="Section Name"
          value={sectionName}
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
          value={term}
          onChange={handleTerm}
        />
        <CTSelect
          required
          id="sel-1"
          label="Visibility"
          helpText="Choose the user group of this course."
          defaultValue="0"
          options={getAccessTypes(api.offeringAccessType)}
          value={accessType}
          onChange={handleVisibility}
        />
      </CTFormRow>
      <CTFormRow>
        <CTInput
          textarea
          id="course-description"
          helpText="The description for this class"
          label="Course description"
          value={description}
          onChange={onDescriptionChange}
        />
      </CTFormRow>
      <CTFormRow padding={[0, 10]}>
        <CTCheckbox
          id="log-event"
          helpText="Turn it on if you would like to receive the statistics of students' perfermance in the future."
          label="Log student events"
          checked={logEventsFlag}
          onChange={onLogEventsFlagChange}
        />
      </CTFormRow>
    </CTFragment>
  );
}