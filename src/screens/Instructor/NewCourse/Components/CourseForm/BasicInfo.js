import React, { useState, useEffect } from 'react';
import {
  CTFragment,
  CTFormHeading,
  CTFormRow,
  CTInput,
  CTSelect,
  CTCheckbox,
} from 'layout';
import { api, util, user, prompt } from 'utils';

function BasicInfo(props) {
  const {
    error,
    enable,
    courseName,
    sectionName,
    term,
    accessType,
    description,
    logEventsFlag,
    setCourseName,
    setSectionName,
    setTerm,
    setAccess,
    setDescription,
    setLogEventsFlag
  } = props;

  // user infomation
  const { universityId } = user.getUserInfo();

  const [terms, setTerms] = useState([]);

  // errors
  const emptyCourseName = error.includes('courseName') && enable;
  const emptySecName = error.includes('sectionName') && enable;
  
  // handle basic info
  const handleCourseNameChange = ({ target: { value } }) => {
    setCourseName(value);
  };

  const handleSectionNameChange = ({ target: { value } }) => {
    setSectionName(value);
  };

  const handleTermChange = ({ target: { value } }) => {
    setTerm(value);
  };

  const handleLogEventsFlagChange = ({ target: { checked } }) => {
    setLogEventsFlag(checked);
  };

  const handleDescriptionChange = ({ target: { value } }) => {
    setDescription(value);
  };

  const handleVisibilityChange = ({ target: { value } }) => {
    setAccess(value);
  };

  const setupTermOptions = async () => {
    try {
      const { data } = await api.getTermsByUniId(universityId);
      setTerms(util.getSelectOptions(data, 'term'));

      if (data.length > 0) {
        setTerm(data[0].id);
      }
    } catch (error_) {
      prompt.error('Could not load terms.');
    }
  };

  useEffect(() => {
    // Get terms list
    setupTermOptions();
  }, []);

  const visibilityOptions = api.offeringAccessType.map(type => ({
    text: type.name,
    value: type.id,
    description: type.description
  }));

  return (
    <CTFragment>
      <CTFormHeading padding={[20, 0, 0, 0]}>Basic Information</CTFormHeading>
      <CTFormRow>
        <CTInput
          required
          id="course-name"
          error={emptyCourseName}
          label="Course Name"
          placeholder="Course Name"
          value={courseName}
          onChange={handleCourseNameChange}
          helpText={emptyCourseName ? "Course Name is required." : ''}
        />
        <CTInput
          required
          id="section-name"
          error={emptySecName}
          label="Section Name"
          placeholder="Section Name"
          value={sectionName}
          onChange={handleSectionNameChange}
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
          onChange={handleTermChange}
        />
        <CTSelect
          required
          id="sel-1"
          label="Visibility"
          helpText="Choose the user group of this course."
          defaultValue="0"
          options={visibilityOptions}
          value={accessType}
          onChange={handleVisibilityChange}
        />
      </CTFormRow>

      <CTFormRow>
        <CTInput
          textarea
          id="course-description"
          helpText="The description for this class"
          label="Course description"
          value={description}
          onChange={handleDescriptionChange}
        />
      </CTFormRow>

      <CTFormRow padding={[0, 10]}>
        <CTCheckbox
          id="log-event"
          helpText="Turn it on if you would like to receive the statistics of students' perfermance in the future."
          label="Log student events"
          checked={logEventsFlag}
          onChange={handleLogEventsFlagChange}
        />
      </CTFormRow>
    </CTFragment>
  );
}

export default BasicInfo;