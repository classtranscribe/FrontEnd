import React, { useState, useEffect } from 'react';
import {
  CTFragment,
  CTFormHeading,
  CTFormRow,
  CTInput,
  CTSelect,
  CTRadio,
} from 'layout';
import { api, prompt, _getSelectOptions } from 'utils';

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
    setLogEventsFlag,
    uniId
  } = props;

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

  const handleLogEventsFlagChange = (event, value) => {
    setLogEventsFlag(value === 'yes');
  };

  const handleDescriptionChange = ({ target: { value } }) => {
    setDescription(value);
  };

  const handleVisibilityChange = ({ target: { value } }) => {
    setAccess(value);
  };

  const setupTermOptions = async () => {
    try {
      const { data } = await api.getTermsByUniId(uniId);
      let _terms = _getSelectOptions(data, 'term');
      _terms = _terms.slice().reverse();
      if (_terms[0]) {
        _terms[0].description = 'Current term';
      }
      setTerms(_terms);

      if (_terms.length > 0) {
        if (!term) setTerm(_terms[0].value);
      }
    } catch (error_) {
      prompt.error('Could not load terms.');
    }
  };

  useEffect(() => {
    // Get terms list
    setupTermOptions();
  }, [uniId]);

  const visibilityOptions = api.offeringAccessType.slice(1).map(type => ({
    text: type.name,
    value: type.id,
    description: type.description
  }));

  const logEventOptions = [
    { value: 'yes', text: 'Yes' },
    { value: 'no', text: 'No' }
  ];

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
        <CTRadio
          id="log-event"
          legend="Do you want to receive the statistics of students' performance in the future?"
          options={logEventOptions}
          onChange={handleLogEventsFlagChange}
          value={logEventsFlag ? 'yes' : 'no'}
          helpText="By choosing yes, we are going log students' performance for your course."
        />
      </CTFormRow>
    </CTFragment>
  );
}

export default BasicInfo;